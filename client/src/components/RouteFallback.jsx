// Lightweight placeholder shown while a lazy-loaded route chunk downloads.
// Kept tiny on purpose — no animation library, just a subtle pulse.

const RouteFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-3 text-gray-500">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-sm font-medium">Loading…</p>
    </div>
  </div>
);

export default RouteFallback;
