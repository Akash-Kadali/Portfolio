import { useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Database,
  Search,
  Sparkles,
} from "lucide-react";

type Evidence = {
  type: string;
  title: string;
  summary: string;
  url: string;
  score: number;
  matchedTerms: string[];
};
type Match = {
  score: number;
  requested: string[];
  matched: string[];
  missing: string[];
  evidence: Evidence[];
  note: string;
};

export default function IntelligenceConsole() {
  const [mode, setMode] = useState<"search" | "match">("search");
  const [query, setQuery] = useState("");
  const [description, setDescription] = useState("");
  const [results, setResults] = useState<Evidence[]>([]);
  const [match, setMatch] = useState<Match | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const search = async (value = query) => {
    if (value.trim().length < 2) return;
    setQuery(value);
    setState("loading");
    setError("");
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query: value }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error);
      setResults(payload.results);
      setState("idle");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Search failed.");
      setState("error");
    }
  };
  const analyze = async () => {
    if (description.trim().length < 30) {
      setError("Add at least 30 characters from a job description.");
      setState("error");
      return;
    }
    setState("loading");
    setError("");
    try {
      const response = await fetch("/api/job-match", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error);
      setMatch(payload);
      setState("idle");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Analysis failed.");
      setState("error");
    }
  };
  const openEvidence = (url: string) => {
    if (url.startsWith("#")) {
      if (matchMedia("(min-width: 1101px)").matches)
        window.dispatchEvent(
          new CustomEvent("decknavigate", { detail: url.slice(1) }),
        );
      else document.querySelector(url)?.scrollIntoView({ behavior: "smooth" });
    } else window.open(url, "_blank", "noopener,noreferrer");
  };
  return (
    <section className="intelligence-console" id="intelligence">
      <div className="intelligence-heading">
        <div>
          <span>KNOWLEDGE NODE / 2026.1</span>
          <h2>
            Query the evidence,
            <br />
            <em>not the marketing copy.</em>
          </h2>
        </div>
        <p>
          This console searches a structured record of experience, research,
          education, and technical work. Job matching is deterministic and links
          every conclusion back to inspectable evidence.
        </p>
      </div>
      <div className="intelligence-shell">
        <div
          className="intelligence-tabs"
          role="tablist"
          aria-label="Intelligence tools"
        >
          <button
            role="tab"
            aria-selected={mode === "search"}
            onClick={() => setMode("search")}
          >
            <Search size={15} />
            Evidence search
          </button>
          <button
            role="tab"
            aria-selected={mode === "match"}
            onClick={() => setMode("match")}
          >
            <BriefcaseBusiness size={15} />
            Role matcher
          </button>
          <span>
            <Database size={13} />
            VERIFIED DATASET
          </span>
        </div>
        {mode === "search" ? (
          <div className="evidence-search">
            <div className="intelligence-input">
              <Search size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && search()}
                placeholder="Try: medical imaging, GraphSAGE, production ML…"
              />
              <button onClick={() => search()} disabled={state === "loading"}>
                {state === "loading" ? "Searching…" : "Search node"}
              </button>
            </div>
            <div className="query-suggestions">
              {[
                "medical imaging transformers",
                "NLP and LLM systems",
                "production ML experience",
              ].map((item) => (
                <button key={item} onClick={() => search(item)}>
                  {item}
                </button>
              ))}
            </div>
            <div className="evidence-results" aria-live="polite">
              {results.map((item) => (
                <button
                  key={`${item.type}-${item.title}`}
                  onClick={() => openEvidence(item.url)}
                >
                  <span>{item.type}</span>
                  <div>
                    <b>{item.title}</b>
                    <p>{item.summary}</p>
                    <small>{item.matchedTerms.join(" · ")}</small>
                  </div>
                  <ArrowUpRight size={16} />
                </button>
              ))}
              {!results.length && state === "idle" && (
                <div className="empty-intelligence">
                  <Sparkles size={19} />
                  <p>
                    Search the verified knowledge node to surface relevant
                    evidence.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="role-matcher">
            <div>
              <label htmlFor="role-description">Paste a job description</label>
              <textarea
                id="role-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Paste the responsibilities and requirements for an AI, ML, computer vision, NLP, or software engineering role…"
              />
              <button onClick={analyze} disabled={state === "loading"}>
                {state === "loading" ? "Mapping evidence…" : "Analyze role fit"}
              </button>
              <small>No description is stored by this demo service.</small>
            </div>
            {match ? (
              <div className="match-output" aria-live="polite">
                <div className="match-score">
                  <b>{match.score}%</b>
                  <span>verified skill coverage</span>
                </div>
                <section>
                  <span>MATCHED</span>
                  <div>
                    {match.matched.map((skill) => (
                      <i key={skill}>{skill}</i>
                    ))}
                  </div>
                </section>
                <section>
                  <span>NOT EVIDENCED</span>
                  <div>
                    {match.missing.length ? (
                      match.missing.map((skill) => (
                        <i className="missing" key={skill}>
                          {skill}
                        </i>
                      ))
                    ) : (
                      <p>No unsupported detected skills.</p>
                    )}
                  </div>
                </section>
                <p>{match.note}</p>
                {match.evidence.slice(0, 3).map((item) => (
                  <button
                    key={item.title}
                    onClick={() => openEvidence(item.url)}
                  >
                    {item.title}
                    <ArrowUpRight size={13} />
                  </button>
                ))}
              </div>
            ) : (
              <div className="empty-intelligence">
                <BriefcaseBusiness size={22} />
                <p>Map a role against verified skills and supporting work.</p>
              </div>
            )}
          </div>
        )}
        {error && (
          <p className="intelligence-error" role="alert">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
