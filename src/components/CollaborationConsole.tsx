import { useState } from "react";
import { ArrowUpRight, CheckCircle2, Send } from "lucide-react";

export default function CollaborationConsole() {
  const [form, setForm] = useState({ name: "", email: "", brief: "" });
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setState("sending");
    setMessage("");
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setState("sent");
      setMessage(`Transmission ${result.id.slice(0, 8)} received.`);
      setForm({ name: "", email: "", brief: "" });
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error ? error.message : "Transmission failed.",
      );
    }
  };
  return (
    <section className="collab-console" aria-labelledby="collab-title">
      <div className="collab-copy">
        <span>06 / COLLABORATION UPLINK</span>
        <h2 id="collab-title">
          Turn an ambiguous problem into a working system.
        </h2>
        <p>
          Describe the decision, dataset, or interface you’re trying to improve.
          The request is validated and recorded by the local API—not sent
          through a decorative form.
        </p>
        <a
          href="https://github.com/Akash-Kadali"
          target="_blank"
          rel="noreferrer"
        >
          Prefer source code? Open GitHub <ArrowUpRight size={14} />
        </a>
      </div>
      <form onSubmit={submit}>
        <div className="form-pair">
          <label>
            Name
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
            />
          </label>
          <label>
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@company.com"
            />
          </label>
        </div>
        <label>
          Problem brief
          <textarea
            required
            minLength={20}
            value={form.brief}
            onChange={(e) => setForm({ ...form, brief: e.target.value })}
            placeholder="What should the system understand, predict, retrieve, or help someone decide?"
          />
        </label>
        <button disabled={state === "sending" || state === "sent"}>
          {state === "sent" ? (
            <>
              <CheckCircle2 size={16} />
              Received
            </>
          ) : (
            <>
              <Send size={16} />
              {state === "sending" ? "Transmitting…" : "Send to backend"}
            </>
          )}
        </button>
        {message && (
          <p className={`form-status ${state}`} role="status">
            {message}
          </p>
        )}
      </form>
    </section>
  );
}
