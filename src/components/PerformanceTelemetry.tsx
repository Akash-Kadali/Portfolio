import { useEffect } from "react";

export default function PerformanceTelemetry() {
  useEffect(() => {
    const transmit = () => {
      const navigation = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;
      const resources = performance.getEntriesByType(
        "resource",
      ) as PerformanceResourceTiming[];
      const payload = {
        navigationMs: Math.round(navigation?.duration ?? performance.now()),
        resourceKb: Math.round(
          resources.reduce((sum, item) => sum + (item.transferSize || 0), 0) /
            1024,
        ),
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
      };
      fetch("/api/vitals", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => undefined);
    };
    if (document.readyState === "complete") window.setTimeout(transmit, 1200);
    else
      window.addEventListener("load", () => window.setTimeout(transmit, 1200), {
        once: true,
      });
  }, []);
  return null;
}
