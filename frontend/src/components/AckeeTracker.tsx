import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import * as ackeeTracker from "ackee-tracker";

const AckeeTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const rawServer = process.env.REACT_APP_ACKEE_SERVER;
    const domainId = process.env.REACT_APP_ACKEE_DOMAIN_ID;

    if (!rawServer || !domainId) {
      return;
    }

    // Ensure server URL has no trailing slashes
    const server = rawServer.replace(/\/+$/, "");

    // Monkey-patch window.fetch to attach required Apollo CSRF preflight headers for Ackee server requests
    const originalFetch = window.fetch;

    window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
          ? input.toString()
          : input.url;

      if (server && url.includes(server)) {
        const headers = new Headers(
          init?.headers || (input instanceof Request ? input.headers : {})
        );
        headers.set("apollo-require-preflight", "true");
        headers.set("Content-Type", "application/json");

        return originalFetch.call(this, input, {
          ...init,
          headers,
        });
      }

      return originalFetch.call(this, input, init);
    };

    const instance = ackeeTracker.create(server, {
      detailed: true,
      ignoreLocalhost: true,
    });

    const record = instance.record(domainId);

    return () => {
      // Clean up fetch interceptor
      window.fetch = originalFetch;

      // Stop tracking
      if (record && typeof record.stop === "function") {
        record.stop();
      }
    };
  }, [location.pathname, location.search]);

  return null;
};

export default AckeeTracker;
