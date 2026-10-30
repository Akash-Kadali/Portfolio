import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  GraduationCap,
  Search,
  Terminal,
  X,
} from "lucide-react";

const commands = [
  {
    label: "Intelligence console",
    detail: "Evidence search · Role matcher",
    target: "#intelligence",
    group: "Navigate",
  },
  {
    label: "Current role",
    detail: "ML Engineer · Parspec",
    target: "#trajectory",
    group: "Navigate",
  },
  {
    label: "Selected systems",
    detail: "Vision · Language · Graph ML",
    target: "#projects",
    group: "Navigate",
  },
  {
    label: "ICONIP publication",
    detail: "Springer LNCS · CaDT-Net",
    target: "#research",
    group: "Navigate",
  },
  {
    label: "Interactive ML lab",
    detail: "Retrieval · Evaluation · Assistant",
    target: "#lab",
    group: "Navigate",
  },
  {
    label: "GitHub",
    detail: "Akash-Kadali",
    target: "https://github.com/Akash-Kadali",
    group: "External",
  },
  {
    label: "LinkedIn",
    detail: "sri-akash-kadali",
    target: "https://www.linkedin.com/in/sri-akash-kadali",
    group: "External",
  },
];

export default function CommandCenter() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const dialog = useRef<HTMLElement>(null);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    if (open) requestAnimationFrame(() => input.current?.focus());
    else setQuery("");
  }, [open]);
  const visible = commands.filter((item) =>
    `${item.label} ${item.detail}`.toLowerCase().includes(query.toLowerCase()),
  );
  const run = (target: string) => {
    setOpen(false);
    if (target.startsWith("#")) {
      if (matchMedia("(min-width: 1101px)").matches)
        window.dispatchEvent(
          new CustomEvent("decknavigate", { detail: target.slice(1) }),
        );
      else
        document.querySelector(target)?.scrollIntoView({
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        });
    } else window.open(target, "_blank", "noopener,noreferrer");
  };
  const containFocus = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab") return;
    const focusable = Array.from(
      dialog.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  return (
    <>
      <button
        className="command-trigger"
        onClick={() => setOpen(true)}
        aria-label="Open command center"
      >
        <Terminal size={14} />
        <span>COMMAND</span>
        <kbd>⌘ K</kbd>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="command-backdrop"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) =>
              event.target === event.currentTarget && setOpen(false)
            }
          >
            <motion.section
              ref={dialog}
              role="dialog"
              aria-modal="true"
              aria-label="Portfolio command center"
              className="command-center"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              onKeyDown={containFocus}
            >
              <header>
                <div>
                  <Terminal size={15} />
                  <span>SK / COMMAND CENTER</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close command center"
                >
                  <X size={17} />
                </button>
              </header>
              <label className="command-search">
                <Search size={18} />
                <input
                  ref={input}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && visible[0]) {
                      event.preventDefault();
                      run(visible[0].target);
                    }
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      document
                        .querySelector<HTMLButtonElement>(
                          ".command-results > button",
                        )
                        ?.focus();
                    }
                  }}
                  placeholder="Navigate, inspect, or connect…"
                />
              </label>
              <div className="recruiter-brief">
                <div>
                  <BriefcaseBusiness size={15} />
                  <span>CURRENT</span>
                  <b>Machine Learning Engineer</b>
                  <small>Parspec · San Mateo</small>
                </div>
                <div>
                  <GraduationCap size={15} />
                  <span>EDUCATION</span>
                  <b>MS Applied Machine Learning</b>
                  <small>University of Maryland · 2026</small>
                </div>
              </div>
              <div className="command-results">
                {visible.map((item, index) => (
                  <button
                    key={item.label}
                    onClick={() => run(item.target)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") run(item.target);
                      if (
                        event.key === "ArrowDown" ||
                        event.key === "ArrowUp"
                      ) {
                        event.preventDefault();
                        const buttons = Array.from(
                          document.querySelectorAll<HTMLButtonElement>(
                            ".command-results > button",
                          ),
                        );
                        const current = buttons.indexOf(event.currentTarget);
                        const offset = event.key === "ArrowDown" ? 1 : -1;
                        buttons[
                          (current + offset + buttons.length) % buttons.length
                        ]?.focus();
                      }
                    }}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <b>{item.label}</b>
                      <small>{item.detail}</small>
                    </div>
                    {item.group === "External" ? (
                      <ArrowUpRight size={15} />
                    ) : (
                      <kbd>↵</kbd>
                    )}
                  </button>
                ))}
                {visible.length === 0 && <p>No matching system found.</p>}
              </div>
              <footer>
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>ESC Close</span>
              </footer>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
