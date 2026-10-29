import { useEffect, useRef, useState } from "react";

const sections = [
  "top",
  "profile",
  "trajectory",
  "projects",
  "research",
  "lab",
  "contact",
];

export default function InterfaceLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("top");
  const [clock, setClock] = useState("00:00:00");

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
    const timer = window.setInterval(
      () => setClock(new Date().toLocaleTimeString("en-US", { hour12: false })),
      1000,
    );
    return () => {
      removeEventListener("scroll", update);
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frame = 0;
    let width = 0;
    let height = 0;
    let pointer = { x: -1000, y: -1000 };
    const count = innerWidth < 700 ? 28 : 64;
    const nodes = Array.from({ length: count }, (_, index) => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00011,
      vy: (Math.random() - 0.5) * 0.00011,
      r: index % 9 === 0 ? 1.8 : 0.8 + Math.random() * 0.8,
    }));
    const resize = () => {
      const ratio = Math.min(devicePixelRatio, 2);
      width = innerWidth;
      height = innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const move = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
    };
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > 1) node.vx *= -1;
        if (node.y < 0 || node.y > 1) node.vy *= -1;
        const x = node.x * width,
          y = node.y * height;
        const pd = Math.hypot(x - pointer.x, y - pointer.y);
        if (pd < 180) {
          node.x += (x - pointer.x) * 0.000003;
          node.y += (y - pointer.y) * 0.000003;
        }
        ctx.beginPath();
        ctx.arc(x, y, node.r, 0, Math.PI * 2);
        ctx.fillStyle =
          pd < 180 ? "rgba(143,248,231,.75)" : "rgba(143,248,231,.24)";
        ctx.fill();
      }
      for (let a = 0; a < nodes.length; a++)
        for (let b = a + 1; b < nodes.length; b++) {
          const ax = nodes[a].x * width,
            ay = nodes[a].y * height,
            bx = nodes[b].x * width,
            by = nodes[b].y * height;
          const distance = Math.hypot(ax - bx, ay - by);
          if (distance < 135) {
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.strokeStyle = `rgba(143,248,231,${(1 - distance / 135) * 0.1})`;
            ctx.stroke();
          }
        }
      frame = requestAnimationFrame(draw);
    };
    resize();
    addEventListener("resize", resize);
    addEventListener("pointermove", move);
    draw();
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="neural-field" aria-hidden="true" />
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
          <b>{clock}</b>
          <span>UTC−07</span>
        </div>
      </aside>
      <div className="corner-diagnostics" aria-hidden="true">
        <span>FPS / AUTO</span>
        <span>NODE / {innerWidth < 700 ? "028" : "064"}</span>
        <span>STATE / NOMINAL</span>
      </div>
    </>
  );
}
