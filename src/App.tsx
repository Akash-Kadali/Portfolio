import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Braces,
  Check,
  Github,
  Menu,
  Radio,
  X,
} from "lucide-react";
import { educations, experiences, projects, technologies } from "./constants";
import InterfaceLayer from "./components/InterfaceLayer";
import SystemPulse from "./components/SystemPulse";
import CollaborationConsole from "./components/CollaborationConsole";
import CommandCenter from "./components/CommandCenter";
import PerformanceTelemetry from "./components/PerformanceTelemetry";
import IntelligenceConsole from "./components/IntelligenceConsole";

const Workbench = lazy(() => import("./components/Workbench"));
const nav = [
  ["Intelligence", "intelligence"],
  ["Profile", "profile"],
  ["Trajectory", "trajectory"],
  ["Work", "projects"],
  ["Research", "research"],
  ["Lab", "lab"],
  ["Contact", "contact"],
];

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("top");
  const syncActive = () => {
    setScrolled(window.scrollY > 40);
    const marker = window.scrollY + window.innerHeight * 0.34;
    let current = "top";
    for (const [, id] of nav) {
      const node = document.getElementById(id);
      const documentTop = node
        ? node.getBoundingClientRect().top + window.scrollY
        : Number.POSITIVE_INFINITY;
      if (documentTop <= marker) current = id;
    }
    setActive(current);
  };
  useEffect(() => {
    syncActive();
    window.addEventListener("scroll", syncActive, { passive: true });
    const onDeck = (event: Event) =>
      setActive((event as CustomEvent<string>).detail);
    window.addEventListener("deckchange", onDeck);
    return () => {
      window.removeEventListener("scroll", syncActive);
      window.removeEventListener("deckchange", onDeck);
    };
  }, []);
  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    const onKey = (event: KeyboardEvent) =>
      event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <>
      <a className="skip-link" href="#profile">
        Skip to portfolio
      </a>
      <header className={`neo-header ${scrolled ? "is-scrolled" : ""}`}>
        <a
          href="#top"
          onClick={() => setActive("top")}
          className="neo-brand"
          aria-label="Back to top"
        >
          <span>SK</span>
          <b>Sri Akash Kadali</b>
        </a>
        <nav className="neo-nav" aria-label="Primary navigation">
          {nav.map(([label, id]) => (
            <a
              className={active === id ? "active" : ""}
              aria-current={active === id ? "location" : undefined}
              key={id}
              href={`#${id}`}
              onClick={() => setActive(id)}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="nav-context" aria-live="polite">
          <span>{nav.find(([, id]) => id === active)?.[0] ?? "Overview"}</span>
        </div>
        <button
          className="neo-menu"
          onClick={() => {
            syncActive();
            setOpen(!open);
          }}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
        <AnimatePresence>
          {open && (
            <motion.nav
              id="mobile-navigation"
              className="neo-mobile-nav"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              {nav.map(([label, id], index) => (
                <a
                  className={active === id ? "active" : ""}
                  aria-current={active === id ? "location" : undefined}
                  key={id}
                  href={`#${id}`}
                  onClick={() => {
                    setActive(id);
                    setOpen(false);
                  }}
                >
                  <span>0{index + 1}</span>
                  {label}
                  {active === id && <Check size={14} />}
                </a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
      {open && (
        <button
          className="menu-scrim"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}

function Hero() {
  return (
    <section className="neo-hero" id="top">
      <div className="hero-scanline" />
      <div className="perspective-floor" aria-hidden="true" />
      <div className="hero-copy">
        <motion.div
          className="signal-label"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <i /> PARSPEC · MACHINE LEARNING ENGINEER · BAY AREA
        </motion.div>
        <motion.div
          className="hero-code"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          SK / APPLIED AI SYSTEMS / 2026
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span>INTELLIGENCE</span>
          <br />
          <em>MADE USEFUL</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.65 }}
        >
          I’m Sri Akash Kadali, a Machine Learning Engineer at Parspec. I build
          end-to-end AI systems across data pipelines, model development,
          backend services, and scalable production inference.
        </motion.p>
        <motion.div className="model-stack">
          <span>
            <i />
            VISION ENCODER
          </span>
          <span>
            <i />
            TRANSFORMER CORE
          </span>
          <span>
            <i />
            CUDA RUNTIME
          </span>
        </motion.div>
        <motion.div
          className="hero-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <a href="#projects" className="neo-button primary">
            Enter selected work <ArrowDownRight size={17} />
          </a>
          <a href="#lab" className="neo-button ghost">
            <Radio size={16} /> Open ML lab
          </a>
        </motion.div>
      </div>
      <motion.div
        className="orbital-system"
        initial={{ opacity: 0, scale: 0.82, rotate: -12 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.2 }}
        aria-hidden="true"
      >
        <div className="core-aura" />
        <div className="orbit orbit-a">
          <span />
        </div>
        <div className="orbit orbit-b">
          <span />
        </div>
        <div className="orbit orbit-c" />
        <div className="orbit-core">
          <b>SK</b>
          <small>NEURAL CORE</small>
        </div>
        <div className="orbit-readout readout-a">
          <span>VISION CONF.</span>0.94
        </div>
        <div className="orbit-readout readout-b">
          <span>LANGUAGE CONF.</span>0.89
        </div>
        <div className="orbit-readout readout-c">
          <span>INFERENCE</span>82ms
        </div>
        <div className="tensor-grid">
          {Array.from({ length: 36 }, (_, i) => (
            <i key={i} style={{ opacity: 0.12 + ((i * 7) % 9) / 12 }} />
          ))}
        </div>
        <div className="holo-panel holo-left">
          <span>LATENT SPACE</span>
          {[72, 48, 91, 64, 83].map((n, i) => (
            <i key={i} style={{ width: `${n}%` }} />
          ))}
          <b>512 × 768</b>
        </div>
        <div className="holo-panel holo-right">
          <span>SYSTEM LOAD</span>
          <div className="load-ring">
            <b>37%</b>
          </div>
          <small>OPTIMAL</small>
        </div>
      </motion.div>
      <div className="hero-index">
        <span>01</span>
        <b>ML Engineer · Parspec</b>
        <small>UMD ’26 · ICONIP ’24</small>
      </div>
    </section>
  );
}

function Profile() {
  const capabilities = [
    {
      name: "Computer vision",
      detail: "Segmentation, inspection, image-language systems",
    },
    {
      name: "Multimodal AI",
      detail: "Voice, vision, retrieval, and grounded interaction",
    },
    {
      name: "ML systems",
      detail: "Evaluation, observability, and production interfaces",
    },
    {
      name: "GPU optimization",
      detail: "Efficient inference and performance-aware pipelines",
    },
  ];
  const [selected, setSelected] = useState(0);
  return (
    <section className="neo-section profile-section" id="profile">
      <div className="section-marker">
        <span>01</span>
        <p>Profile / Operating principle</p>
      </div>
      <div className="profile-grid">
        <h2>
          I don’t just train models.
          <br />
          <em>I build the systems around them.</em>
        </h2>
        <div className="profile-copy">
          <p>
            I graduated from the University of Maryland in 2026 with an MS in
            Applied Machine Learning. Today, I work at Parspec across applied
            AI, natural language systems, backend engineering, and production
            deployment.
          </p>
          <p>
            My experience at Parspec, SnugFit Solutions, Ayar Labs, IIT Indore,
            and MNIT Jaipur spans the full ML lifecycle—from data and
            experimentation to REST APIs, containerization, scalable inference,
            and interfaces people can trust.
          </p>
        </div>
      </div>
      <div
        className="capability-rail"
        role="tablist"
        aria-label="Core capabilities"
      >
        {capabilities.map((item, i) => (
          <button
            role="tab"
            aria-selected={selected === i}
            onClick={() => setSelected(i)}
            key={item.name}
          >
            <span>0{i + 1}</span>
            <b>{item.name}</b>
            <ArrowUpRight size={16} />
          </button>
        ))}
      </div>
      <div className="capability-detail" role="tabpanel">
        <span>ACTIVE CAPABILITY / 0{selected + 1}</span>
        <p>{capabilities[selected].detail}</p>
      </div>
    </section>
  );
}

function Trajectory() {
  return (
    <section className="neo-section" id="trajectory">
      <div className="section-marker">
        <span>02</span>
        <p>Trajectory / Signal log</p>
      </div>
      <div className="trajectory-layout">
        <div className="trajectory-title">
          <p>FIELD NOTES</p>
          <h2>
            Built through
            <br />
            research and repetition.
          </h2>
          <div className="coordinate-card">
            <span>ACTIVE VECTOR</span>
            <b>Applied ML</b>
            <small>Vision · Language · Systems</small>
          </div>
        </div>
        <div className="signal-log">
          {experiences.map((item: any, index: number) => (
            <article key={`${item.company_name}-${item.date}`}>
              <div className="log-node">
                <i />
              </div>
              <span className="log-index">0{index + 1}</span>
              <div>
                <small>{item.date}</small>
                <h3>{item.title}</h3>
                <p>{item.company_name}</p>
              </div>
            </article>
          ))}
          {educations.map((item: any, index: number) => (
            <article className="education-log" key={item.school_name}>
              <div className="log-node">
                <i />
              </div>
              <span className="log-index">E{index + 1}</span>
              <div>
                <small>{item.date}</small>
                <h3>{item.degree}</h3>
                <p>{item.school_name}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectArchive() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Vision", "Language", "Graph"];
  const matches = (project: any) => {
    const text =
      `${project.name} ${project.description} ${project.tags.map((tag: any) => tag.name).join(" ")}`.toLowerCase();
    return (
      filter === "All" ||
      (filter === "Vision" && /(vision|image|segment|tumor)/.test(text)) ||
      (filter === "Language" &&
        /(speech|llama|caption|hate|language|voice)/.test(text)) ||
      (filter === "Graph" && /(graph|embedding|user)/.test(text))
    );
  };
  const visibleProjects = projects.filter(matches);
  return (
    <section className="neo-section project-section" id="projects">
      <div className="section-marker">
        <span>03</span>
        <p>Selected work / Project archive</p>
      </div>
      <div className="project-intro">
        <h2>
          Systems with
          <br />
          <em>a point of view.</em>
        </h2>
        <p>
          Six experiments in teaching machines to see, speak, rank, and
          understand. Each begins with a difficult question and ends with
          something testable.
        </p>
      </div>
      <div className="project-controls">
        <div role="group" aria-label="Filter projects">
          {filters.map((item) => (
            <button
              className={filter === item ? "active" : ""}
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
              key={item}
            >
              {item}
            </button>
          ))}
        </div>
        <span aria-live="polite">{visibleProjects.length} systems indexed</span>
      </div>
      <div className="project-archive">
        {visibleProjects.map((project: any) => {
          const index = projects.indexOf(project);
          return (
            <motion.a
              aria-label={`Open ${project.name} project on GitHub in a new tab`}
              href={project.website_link}
              target="_blank"
              rel="noopener noreferrer"
              className="archive-row"
              key={project.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ x: 6 }}
            >
              <span className="archive-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="archive-image">
                <img
                  src={project.image}
                  alt={`${project.name} project preview`}
                  loading="lazy"
                />
              </div>
              <div className="archive-copy">
                <small>
                  {project.tags.map((tag: any) => tag.name).join(" · ")}
                </small>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <span className="project-link-label">
                  View repository <ArrowUpRight size={12} />
                </span>
              </div>
              <ArrowUpRight className="archive-arrow" />
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}

function Toolchain() {
  return (
    <section className="toolchain" aria-label="Technology toolchain">
      <div className="toolchain-label">
        <Braces size={16} /> TOOLCHAIN / LIVE
      </div>
      <div className="toolchain-track">
        {[...technologies, ...technologies].map((tech: any, index) => (
          <div key={`${tech.name}-${index}`}>
            <img src={tech.icon} alt="" />
            <span>{tech.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ResearchTransmission() {
  return (
    <section className="research-transmission" id="research">
      <div className="research-code">04 / PEER-REVIEWED TRANSMISSION</div>
      <div className="research-year">’24</div>
      <div className="research-copy">
        <span>SPRINGER LNCS · VOLUME 15292 · ICONIP</span>
        <h2>CaDT-Net</h2>
        <h3>
          A Cascaded Deformable Transformer Network for Multiclass Breast Cancer
          Histopathological Image Classification
        </h3>
        <p>
          A transformer framework combining a convolutional vision backbone with
          deformable attention to capture global context and local morphology in
          histopathology imagery.
        </p>
        <div className="research-actions">
          <a
            href="https://lnkd.in/dZ7Ptmpa"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read publication <ArrowUpRight size={14} />
          </a>
          <a
            href="https://github.com/Akash-Kadali/CaDT-Net-A-Cascaded-Deformable-Transformer-Network"
            target="_blank"
            rel="noopener noreferrer"
          >
            Inspect code <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
      <div className="research-metrics" aria-label="Publication details">
        <span>
          <b>31st</b> International Conference on Neural Information Processing
        </span>
        <span>
          <b>Auckland</b> New Zealand
        </span>
        <span>
          <b>Medical AI</b> Vision transformers
        </span>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="neo-contact" id="contact">
      <div className="contact-radar">
        <div />
        <div />
        <span />
      </div>
      <div className="contact-copy">
        <div className="signal-label">
          <i /> CHANNEL OPEN
        </div>
        <h2>
          Bring me the problem
          <br />
          that doesn’t fit the template.
        </h2>
        <p>
          I’m interested in ambitious ML products, research engineering, and
          teams that care about making intelligence understandable.
        </p>
        <a
          className="neo-button primary"
          href="https://github.com/Akash-Kadali"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github size={17} /> Start on GitHub
        </a>
      </div>
      <footer>
        <span>© {new Date().getFullYear()} Sri Akash Kadali</span>
        <span>Designed as a neural observatory</span>
        <a href="#top">Return to orbit ↑</a>
      </footer>
    </section>
  );
}

const scenes = [
  ["top", "Origin"],
  ["intelligence", "Intelligence"],
  ["profile", "Identity"],
  ["trajectory", "Trajectory"],
  ["projects", "Systems"],
  ["research", "Research + Lab"],
  ["contact", "Connect"],
];

function SpatialDeck() {
  const track = useRef<HTMLDivElement>(null);
  const locked = useRef(false);
  const activeSceneRef = useRef(0);
  const wheelUnlock = useRef<number | null>(null);
  const wheelIntentReset = useRef<number | null>(null);
  const wheelIntent = useRef(0);
  const lockStartedAt = useRef(0);
  const transitionFrame = useRef<number | null>(null);
  const [activeScene, setActiveScene] = useState(0);
  const go = (index: number) => {
    const node = track.current;
    if (!node) return;
    const destination = index * node.clientWidth;
    if (transitionFrame.current)
      window.cancelAnimationFrame(transitionFrame.current);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.scrollLeft = destination;
      return;
    }
    const origin = node.scrollLeft;
    const distance = destination - origin;
    if (Math.abs(distance) < 1) return;
    const started = performance.now();
    const duration = Math.min(
      1180,
      940 + (Math.abs(distance) / node.clientWidth - 1) * 70,
    );
    node.classList.add("is-transitioning");
    const animate = (now: number) => {
      const progress = Math.min(1, (now - started) / duration);
      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      node.scrollLeft = origin + distance * eased;
      if (progress < 1)
        transitionFrame.current = requestAnimationFrame(animate);
      else {
        node.scrollLeft = destination;
        node.classList.remove("is-transitioning");
        transitionFrame.current = null;
      }
    };
    transitionFrame.current = requestAnimationFrame(animate);
  };
  useEffect(() => {
    const node = track.current;
    if (!node) return;
    const desktop = matchMedia("(min-width: 1101px)");
    const sync = () => {
      if (!desktop.matches) return;
      const index = Math.max(
        0,
        Math.min(
          scenes.length - 1,
          Math.round(node.scrollLeft / node.clientWidth),
        ),
      );
      activeSceneRef.current = index;
      setActiveScene(index);
      let sectionId = scenes[index][0];
      if (
        index === 5 &&
        (document.getElementById("lab")?.getBoundingClientRect().top ??
          innerHeight) <
          innerHeight * 0.58
      )
        sectionId = "lab";
      window.dispatchEvent(
        new CustomEvent("deckchange", { detail: sectionId }),
      );
    };
    const scheduleWheelUnlock = () => {
      if (wheelUnlock.current) window.clearTimeout(wheelUnlock.current);
      const elapsed = performance.now() - lockStartedAt.current;
      wheelUnlock.current = window.setTimeout(
        () => {
          locked.current = false;
          wheelUnlock.current = null;
        },
        Math.max(260, 1080 - elapsed),
      );
    };
    const wheel = (event: WheelEvent) => {
      if (!desktop.matches || Math.abs(event.deltaY) < Math.abs(event.deltaX))
        return;
      if (locked.current) {
        event.preventDefault();
        wheelIntent.current = 0;
        scheduleWheelUnlock();
        return;
      }
      const panel = (event.target as HTMLElement).closest(
        ".deck-scene",
      ) as HTMLElement | null;
      if (!panel) return;
      const maxY = panel.scrollHeight - panel.clientHeight;
      const canMoveInside =
        maxY > 4 &&
        ((event.deltaY > 0 && panel.scrollTop < maxY - 3) ||
          (event.deltaY < 0 && panel.scrollTop > 3));
      if (canMoveInside) return;
      event.preventDefault();
      wheelIntent.current += event.deltaY;
      if (wheelIntentReset.current)
        window.clearTimeout(wheelIntentReset.current);
      wheelIntentReset.current = window.setTimeout(() => {
        wheelIntent.current = 0;
        wheelIntentReset.current = null;
      }, 140);
      if (Math.abs(wheelIntent.current) < 72) return;
      const direction = wheelIntent.current > 0 ? 1 : -1;
      wheelIntent.current = 0;
      locked.current = true;
      lockStartedAt.current = performance.now();
      go(
        Math.max(
          0,
          Math.min(scenes.length - 1, activeSceneRef.current + direction),
        ),
      );
      scheduleWheelUnlock();
    };
    const keyboard = (event: KeyboardEvent) => {
      if (
        !desktop.matches ||
        /INPUT|TEXTAREA|SELECT/.test((event.target as HTMLElement).tagName)
      )
        return;
      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        go(Math.min(scenes.length - 1, activeSceneRef.current + 1));
      }
      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        go(Math.max(0, activeSceneRef.current - 1));
      }
    };
    const navigate = (id: string) => {
      if (!desktop.matches) return;
      const sceneBySection: Record<string, number> = {
        top: 0,
        intelligence: 1,
        profile: 2,
        trajectory: 3,
        projects: 4,
        research: 5,
        lab: 5,
        contact: 6,
      };
      const sceneIndex = sceneBySection[id];
      if (sceneIndex === undefined) return;
      go(sceneIndex);
      const panel = node.children[sceneIndex] as HTMLElement;
      const target = document.getElementById(id);
      if (target) {
        const alignTarget = () => {
          const targetTop =
            target.getBoundingClientRect().top -
            panel.getBoundingClientRect().top +
            panel.scrollTop -
            76;
          panel.scrollTo({
            top: Math.max(0, targetTop),
            behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "auto"
              : "smooth",
          });
        };
        alignTarget();
      }
      if (sceneIndex !== activeSceneRef.current) {
        window.setTimeout(() => {
          const delayedTarget = document.getElementById(id);
          if (!delayedTarget) return;
          const delayedTop =
            delayedTarget.getBoundingClientRect().top -
            panel.getBoundingClientRect().top +
            panel.scrollTop -
            76;
          panel.scrollTo({
            top: Math.max(0, delayedTop),
            behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "auto"
              : "smooth",
          });
        }, 820);
      }
    };
    const internalLinks = (event: MouseEvent) => {
      if (!desktop.matches) return;
      const anchor = (event.target as HTMLElement).closest(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      event.preventDefault();
      navigate(anchor.hash.slice(1));
    };
    const requestedNavigation = (event: Event) =>
      navigate((event as CustomEvent<string>).detail);
    node.addEventListener("scroll", sync, { passive: true });
    node.addEventListener("wheel", wheel, { passive: false });
    const panels = Array.from(node.querySelectorAll(".deck-scene"));
    panels.forEach((panel) =>
      panel.addEventListener("scroll", sync, { passive: true }),
    );
    window.addEventListener("keydown", keyboard);
    document.addEventListener("click", internalLinks);
    window.addEventListener("decknavigate", requestedNavigation);
    sync();
    return () => {
      node.removeEventListener("scroll", sync);
      node.removeEventListener("wheel", wheel);
      panels.forEach((panel) => panel.removeEventListener("scroll", sync));
      window.removeEventListener("keydown", keyboard);
      document.removeEventListener("click", internalLinks);
      window.removeEventListener("decknavigate", requestedNavigation);
      if (wheelUnlock.current) window.clearTimeout(wheelUnlock.current);
      if (wheelIntentReset.current)
        window.clearTimeout(wheelIntentReset.current);
      if (transitionFrame.current)
        window.cancelAnimationFrame(transitionFrame.current);
      node.classList.remove("is-transitioning");
      locked.current = false;
    };
  }, []);
  return (
    <main className="spatial-deck">
      <div className="deck-track" ref={track}>
        <div className="deck-scene scene-origin">
          <Hero />
          <SystemPulse />
        </div>
        <div className="deck-scene scene-intelligence">
          <IntelligenceConsole />
        </div>
        <div className="deck-scene scene-profile">
          <Profile />
        </div>
        <div className="deck-scene scene-trajectory">
          <Trajectory />
          <Toolchain />
        </div>
        <div className="deck-scene scene-projects">
          <ProjectArchive />
        </div>
        <div className="deck-scene scene-research">
          <ResearchTransmission />
          <Suspense
            fallback={
              <div className="lab-loading">CALIBRATING LAB INTERFACE…</div>
            }
          >
            <Workbench />
          </Suspense>
        </div>
        <div className="deck-scene scene-contact">
          <CollaborationConsole />
          <Contact />
        </div>
      </div>
      <nav className="deck-navigator" aria-label="Scene navigation">
        <span>
          {String(activeScene + 1).padStart(2, "0")} /{" "}
          {String(scenes.length).padStart(2, "0")}
        </span>
        <div>
          {scenes.map(([id, label], index) => (
            <button
              key={id}
              className={activeScene === index ? "active" : ""}
              onClick={() => go(index)}
              aria-label={`Open ${label} scene`}
            >
              <i />
              {label}
            </button>
          ))}
        </div>
        <small>← → / SCROLL</small>
      </nav>
    </main>
  );
}

export default function App() {
  return (
    <div className="neo-site">
      <InterfaceLayer />
      <PerformanceTelemetry />
      <Header />
      <CommandCenter />
      <SpatialDeck />
    </div>
  );
}
