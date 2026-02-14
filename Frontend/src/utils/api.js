export const getDefaultApiBaseUrl = () => {
  if (typeof window === "undefined") return "http://localhost:5000";
  return `${window.location.protocol}//${window.location.hostname}:5000`;
};

export const resolveApiBaseUrl = () => {
  const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").trim();
  const fallbackBaseUrl = getDefaultApiBaseUrl();
  if (!rawBaseUrl) return fallbackBaseUrl;

  if (typeof window === "undefined") return rawBaseUrl;

  try {
    const parsed = new URL(rawBaseUrl);
    const onLocalNetworkHost =
      !["localhost", "127.0.0.1"].includes(window.location.hostname);
    const pointsToLocalhost = ["localhost", "127.0.0.1"].includes(
      parsed.hostname
    );

    // If app is opened from LAN and env points to localhost, use host machine IP.
    if (onLocalNetworkHost && pointsToLocalhost) {
      return `${window.location.protocol}//${window.location.hostname}:${
        parsed.port || "5000"
      }`;
    }
  } catch {
    return rawBaseUrl;
  }

  return rawBaseUrl;
};

export const API_BASE_URL = resolveApiBaseUrl().replace(/\/$/, "");

export const CURRENT_ORIGIN =
  typeof window !== "undefined" ? window.location.origin : "";

export const loadExternalScript = (src) =>
  new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("External scripts are unavailable outside browser."));
      return;
    }

    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (existing.getAttribute("data-loaded") === "true") {
        resolve(true);
        return;
      }

      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error(`Failed to load script: ${src}`)),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.setAttribute("data-loaded", "true");
      resolve(true);
    };
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
