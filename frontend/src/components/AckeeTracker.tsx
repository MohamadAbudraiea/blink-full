import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import * as ackeeTracker from "ackee-tracker";

// Helper to determine if a URL target is the Ackee analytics server
const isAckeeRequest = (urlStr: string): boolean => {
  if (!urlStr) return false;
  const lowerUrl = urlStr.toLowerCase();
  const server = process.env.REACT_APP_ACKEE_SERVER || "";
  const cleanServer = server.replace(/\/+$/, "").toLowerCase();

  return (
    (cleanServer !== "" && lowerUrl.includes(cleanServer)) ||
    lowerUrl.includes("monitor.blink-cars.com") ||
    lowerUrl.includes("easypanel.host") ||
    lowerUrl.includes("ackee")
  );
};

// Global interceptor setup (runs once when module is imported)
if (typeof window !== "undefined") {
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
  const originalFetch = window.fetch;

  // Intercept XHR open
  XMLHttpRequest.prototype.open = function (
    method: string,
    url: string | URL,
    ...args: any[]
  ) {
    const urlStr = typeof url === "string" ? url : url.toString();
    (this as any)._isAckee = isAckeeRequest(urlStr);

    const res = originalOpen.apply(this, [method, url, ...args] as any);

    if ((this as any)._isAckee) {
      try {
        originalSetRequestHeader.call(this, "apollo-require-preflight", "true");
        originalSetRequestHeader.call(this, "x-apollo-operation-name", "AckeeTrack");
      } catch (e) {
        console.warn("[Ackee Interceptor] Error in open:", e);
      }
    }

    return res;
  };

  // Intercept XHR setRequestHeader
  XMLHttpRequest.prototype.setRequestHeader = function (
    header: string,
    value: string
  ) {
    if ((this as any)._isAckee) {
      try {
        originalSetRequestHeader.call(this, "apollo-require-preflight", "true");
        originalSetRequestHeader.call(this, "x-apollo-operation-name", "AckeeTrack");
      } catch (e) {
        // ignore
      }
    }
    return originalSetRequestHeader.call(this, header, value);
  };

  // Intercept fetch as fallback
  window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
    const urlStr =
      typeof input === "string"
        ? input
        : input instanceof URL
        ? input.toString()
        : input.url;

    if (isAckeeRequest(urlStr)) {
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
}

const AckeeTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const rawServer = process.env.REACT_APP_ACKEE_SERVER;
    const domainId = process.env.REACT_APP_ACKEE_DOMAIN_ID;

    if (!rawServer || !domainId) {
      return;
    }

    const server = rawServer.replace(/\/+$/, "");

    // Create tracker instance & record view
    const instance = ackeeTracker.create(server, {
      detailed: true,
      ignoreLocalhost: true,
    });

    const record = instance.record(domainId);

    return () => {
      // Stop tracking on unmount / route change
      if (record && typeof record.stop === "function") {
        record.stop();
      }
    };
  }, [location.pathname, location.search]);

  return null;
};

export default AckeeTracker;
