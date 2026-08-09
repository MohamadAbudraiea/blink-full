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

    // 1. Intercept XMLHttpRequest (ackee-tracker uses XHR under the hood)
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;
    const originalXHRSetHeader = XMLHttpRequest.prototype.setRequestHeader;

    XMLHttpRequest.prototype.open = function (
      method: string,
      url: string | URL,
      ...rest: any[]
    ) {
      const urlString = typeof url === "string" ? url : url.toString();
      (this as any)._isAckeeRequest = Boolean(server && urlString.includes(server));
      return originalXHROpen.apply(this, [method, url, ...rest] as any);
    };

    XMLHttpRequest.prototype.send = function (
      body?: Document | XMLHttpRequestBodyInit | null
    ) {
      if ((this as any)._isAckeeRequest) {
        originalXHRSetHeader.call(this, "apollo-require-preflight", "true");
        originalXHRSetHeader.call(this, "x-apollo-operation-name", "AckeeTrack");
      }
      return originalXHRSend.call(this, body);
    };

    // 2. Intercept window.fetch as a fallback
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
      XMLHttpRequest.prototype.send = originalXHRSend;
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
