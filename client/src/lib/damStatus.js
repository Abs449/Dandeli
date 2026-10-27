// One /api/dam-status request per page load, shared by HeroContent and
// Services (each used to fetch it separately). The server caches the SLDC
// reading for 5 minutes, so there is nothing fresher to gain by re-fetching.
let request = null;

export function getDamStatus() {
  if (!request) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const apiUrl = import.meta.env.VITE_API_URL || "";
    request = fetch(`${apiUrl}/api/dam-status`, { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to fetch live status.");
        }
        return data;
      })
      .finally(() => clearTimeout(timeoutId));
    // Let a later mount retry instead of reusing a failed request.
    request.catch(() => {
      request = null;
    });
  }
  return request;
}
