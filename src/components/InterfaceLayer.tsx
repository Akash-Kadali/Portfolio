import { useEffect, useState } from "react";

const sections = [
  "top",
  "intelligence",
  "profile",
  "trajectory",
  "projects",
  "research",
  "lab",
  "contact",
];

export default function InterfaceLayer() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("top");

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      setProgress(max > 0 ? Math.min(100, (scrollY / max) * 100) : 0);
      const marker = scrollY + innerHeight * 0.42;
      let current = "top";
      for (const id of sections) {
        const node = document.getElementById(id);
        const documentTop = node
          ? node.getBoundingClientRect().top + window.scrollY
          : Number.POSITIVE_INFINITY;
        if (documentTop <= marker) current = id;
      }
      setActive(current);
    };
    update();
    addEventListener("scroll", update, { passive: true });
    return () => {
      removeEventListener("scroll", update);
    };
  }, []);

  useEffect(() => {
    const onDeck = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      const index = sections.indexOf(id);
      if (index >= 0) {
        setActive(id);
        setProgress((index / Math.max(1, sections.length - 1)) * 100);
      }
    };
    window.addEventListener("deckchange", onDeck);
    return () => window.removeEventListener("deckchange", onDeck);
  }, []);

  return (
    <>
      <div className="neural-field" aria-hidden="true" />
      <aside className="system-rail" aria-hidden="true">
        <div className="rail-brand">
          INFERENCE
          <br />
          ENGINE
        </div>
        <div className="rail-progress">
          <i style={{ height: `${progress}%` }} />
        </div>
        <div className="rail-sections">
          {sections.map((id, index) => (
            <span className={active === id ? "active" : ""} key={id}>
              {String(index).padStart(2, "0")}
            </span>
          ))}
        </div>
        <div className="rail-clock">
          <b>SK / ML</b>
          <span>BAY AREA</span>
        </div>
      </aside>
      <div className="corner-diagnostics" aria-hidden="true">
        <span>FPS / AUTO</span>
        <span>NODE / {innerWidth < 700 ? "022" : "042"}</span>
        <span>STATE / NOMINAL</span>
      </div>
    </>
  );
}
