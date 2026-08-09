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

    // Clean server URL (remove trailing slashes)
    const server = rawServer.replace(/\/+$/, "");
    let serverHost = "";
    try {
      serverHost = new URL(server).hostname;
    } catch {
      serverHost = server;
    }

    // Intercept XMLHttpRequest (ackee-tracker uses XHR under the hood)
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSetHeader = XMLHttpRequest.prototype.setRequestHeader;

    XMLHttpRequest.prototype.open = function (
      method: string,
      url: string | URL,
      ...rest: any[]
    ) {
      const urlString = typeof url === "string" ? url : url.toString();
      const isAckeeRequest = Boolean(
        (server && urlString.includes(server)) ||
          (serverHost && urlString.includes(serverHost))
      );

      const result = originalXHROpen.apply(this, [method, url, ...rest] as any);

      if (isAckeeRequest) {
        try {
          originalXHRSetHeader.call(this, "apollo-require-preflight", "true");
          originalXHRSetHeader.call(this, "x-apollo-operation-name", "AckeeTrack");
          originalXHRSetHeader.call(this, "Content-Type", "application/json");
        } catch (err) {
          console.warn("Could not set Ackee headers on XHR:", err);
        }
      }

      return result;
    };

    // Intercept window.fetch as fallback
    const originalFetch = window.fetch;

    window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
          ? input.toString()
          : input.url;

      const isAckeeRequest = Boolean(
        (server && url.includes(server)) ||
          (serverHost && url.includes(serverHost))
      );

      if (isAckeeRequest) {
        const headers = new Headers(
          init?.headers || (input instanceof Request ? input.headers : {})
        );
        headers.set("apollo-require-preflight", "true");
        headers.set("x-apollo-operation-name", "AckeeTrack");
        headers.set("Content-Type", "application/json");

        return originalFetch.call(this, input, {
          ...init,
          headers,
        });
      }

      return originalFetch.call(this, input, init);
    };

    // Create tracker instance & record view
    const instance = ackeeTracker.create(server, {
      detailed: true,
      ignoreLocalhost: true,
    });

    const record = instance.record(domainId);

    return () => {
      // Clean up interceptors
      XMLHttpRequest.prototype.open = originalXHROpen;
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
