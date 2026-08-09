import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import * as ackeeTracker from "ackee-tracker";

const AckeeTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const server = process.env.REACT_APP_ACKEE_SERVER;
    const domainId = process.env.REACT_APP_ACKEE_DOMAIN_ID;
    console.log("server", server);
    console.log("domainId", domainId);
    if (!server || !domainId) {
      return;
    }

    const instance = ackeeTracker.create(server, {
      detailed: true,
      ignoreLocalhost: true,
    });

    const record = instance.record(domainId);

    return () => {
      if (record && typeof record.stop === "function") {
        record.stop();
      }
    };
  }, [location.pathname, location.search]);

  return null;
};

export default AckeeTracker;
