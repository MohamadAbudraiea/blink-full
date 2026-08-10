import { OpenPanel } from "@openpanel/web";

function getApiUrl(): string | undefined {
  const rawUrl = import.meta.env.VITE_OPENPANEL_URL?.trim();
  if (!rawUrl) return undefined;

  // Strip trailing slashes
  const cleanUrl = rawUrl.replace(/\/+$/, "");
  // Ensure /api path suffix is present for self-hosted instances
  return cleanUrl.endsWith("/api") ? cleanUrl : `${cleanUrl}/api`;
}

const clientKey = import.meta.env.VITE_OPENPANEL_CLIENT_KEY?.trim();
const apiUrl = getApiUrl();

let opInstance: OpenPanel | null = null;

if (clientKey) {
  opInstance = new OpenPanel({
    clientId: clientKey,
    apiUrl: apiUrl,
    trackScreenViews: true,
    trackOutgoingLinks: true,
    trackAttributes: true,
  });
} else {
  console.warn(
    "[OpenPanel] VITE_OPENPANEL_CLIENT_KEY environment variable is missing. OpenPanel tracking disabled."
  );
}

export const op = opInstance;

export function sendTestEvent() {
  if (opInstance) {
    opInstance.track("test_openpanel", {
      source: "blink-react",
    });
  }
}
