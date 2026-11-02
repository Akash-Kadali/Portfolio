import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import * as Tabs from "@radix-ui/react-tabs";
import { create } from "zustand";
import { ArrowUpDown, Bot, FileText, Gauge, Search, SlidersHorizontal, Upload } from "lucide-react";
import { Button } from "./ui/Button";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import type { UIMessage } from "ai";

type Result = {
  rank: number;
  document: string;
  match: string;
  score: number;
  latency: number;
};

type LabState = {
  model: string;
  pdfUrl: string | null;
  setModel: (model: string) => void;
  setPdfUrl: (url: string | null) => void;
};

type AssistantMessage = Pick<UIMessage, "id" | "role"> & { text: string };

const useLabStore = create<LabState>((set) => ({
  model: "hybrid-v2",
  pdfUrl: null,
  setModel: (model) => set({ model }),
  setPdfUrl: (pdfUrl) => set({ pdfUrl }),
}));

const results: Result[] = [
  { rank: 1, document: "Ayar optical engine", match: "Thermal drift compensation", score: 0.94, latency: 82 },
  { rank: 2, document: "Chiplet inspection guide", match: "Surface anomaly detection", score: 0.89, latency: 76 },
  { rank: 3, document: "Packaging specification", match: "Alignment tolerance", score: 0.84, latency: 91 },
  { rank: 4, document: "Defect taxonomy", match: "Edge fracture class", score: 0.78, latency: 69 },
];

const metrics = [
  { k: "K=1", precision: 94, recall: 61 },
  { k: "K=3", precision: 89, recall: 78 },
  { k: "K=5", precision: 84, recall: 88 },
  { k: "K=10", precision: 76, recall: 95 },
];

const columnHelper = createColumnHelper<Result>();

const Workbench = () => {
  const [sorting, setSorting] = useState<SortingState>([{ id: "rank", desc: false }]);
  const [message, setMessage] = useState("");
  const [assistantReply, setAssistantReply] = useState<AssistantMessage>({ id: "welcome", role: "assistant", text: "Ask about ranking quality, latency, or a selected document." });
  const [assistantBusy, setAssistantBusy] = useState(false);
  const [selectedResult, setSelectedResult] = useState<Result | null>(results[0]);
  const { model, setModel, pdfUrl, setPdfUrl } = useLabStore();

  const { data = [], isFetching, refetch } = useQuery({
    queryKey: ["retrieval-results", model],
    queryFn: async () => { const response = await fetch(`/api/retrieval?model=${encodeURIComponent(model)}`); if (!response.ok) throw new Error("Retrieval service unavailable"); const payload = await response.json(); return payload.data as Result[]; },
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor("rank", { header: "Rank", cell: (info) => `#${info.getValue()}` }),
      columnHelper.accessor("document", { header: "Document" }),
      columnHelper.accessor("match", { header: "Best match" }),
      columnHelper.accessor("score", { header: "Score", cell: (info) => info.getValue().toFixed(2) }),
      columnHelper.accessor("latency", { header: "Latency", cell: (info) => `${info.getValue()} ms` }),
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handlePdf = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(URL.createObjectURL(file));
  };

  const askAssistant = async () => {
    if (!message.trim()) return;
    const outgoing = message.trim(); setMessage(""); setAssistantBusy(true);
    try { const response = await fetch("/api/assistant", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ message: outgoing, selectedDocument: selectedResult?.document }) }); const payload = await response.json(); if (!response.ok) throw new Error(payload.error); setAssistantReply({ id: crypto.randomUUID(), role: "assistant", text: payload.answer }); }
    catch { setAssistantReply({ id: crypto.randomUUID(), role: "assistant", text: "The inference service is unavailable. Check the live system status and try again." }); }
    finally { setAssistantBusy(false); }
  };

  return (
    <>
      <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className={styles.sectionSubText}>05 / ML product lab</p>
          <h2 className={styles.sectionHeadText}>A working surface,<br />not a static mockup.</h2>
        </div>
        <p className="max-w-md text-[15px] leading-7 text-secondary">
          A compact demo of how I build search and ML interfaces: observable, filterable, document-aware, and ready for streaming AI.
        </p>
      </div>

      <div className="workbench-shell rounded-[28px] border border-white/10 bg-[#09151f]/95 p-3 shadow-2xl shadow-black/30 md:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3"><span className="lab-status" /><span className="text-sm font-semibold text-white">Retrieval evaluation / live</span></div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={15} className="text-secondary" />
            <select value={model} onChange={(e) => setModel(e.target.value)} className="lab-select" aria-label="Retrieval model">
              <option value="hybrid-v2">Hybrid v2</option>
              <option value="dense-v1">Dense v1</option>
            </select>
            <Button size="sm" variant="outline" onClick={() => refetch()} disabled={isFetching}>{isFetching ? "Refreshing…" : "Refresh"}</Button>
          </div>
        </div>

        <Tabs.Root defaultValue="results">
          <Tabs.List className="lab-tabs" aria-label="ML workbench views">
            <Tabs.Trigger value="results"><Search size={15} /> Results</Tabs.Trigger>
            <Tabs.Trigger value="evaluation"><Gauge size={15} /> Evaluation</Tabs.Trigger>
            <Tabs.Trigger value="documents"><FileText size={15} /> Documents</Tabs.Trigger>
            <Tabs.Trigger value="assistant"><Bot size={15} /> Assistant</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="results" className="lab-panel overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-secondary">
                {table.getHeaderGroups().map((group) => <tr key={group.id}>{group.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3"><button className="flex items-center gap-2" onClick={header.column.getToggleSortingHandler()}>{flexRender(header.column.columnDef.header, header.getContext())}<ArrowUpDown size={12} /></button></th>
                ))}</tr>)}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => <tr key={row.id} tabIndex={0} aria-selected={selectedResult?.document === row.original.document} onClick={() => setSelectedResult(row.original)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelectedResult(row.original)} className="result-row border-t border-white/[0.07] text-[#dce5ea]">{row.getVisibleCells().map((cell) => <td key={cell.id} className="px-4 py-4">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>)}
              </tbody>
            </table>
            {selectedResult && <div className="result-inspector" aria-live="polite"><span>SELECTED EVIDENCE</span><b>{selectedResult.document}</b><p>{selectedResult.match} · confidence {selectedResult.score.toFixed(2)} · {selectedResult.latency} ms</p></div>}
          </Tabs.Content>

          <Tabs.Content value="evaluation" className="lab-panel min-h-[360px] p-4 md:p-6">
            <div className="mb-5"><p className="text-sm font-semibold text-white">Retrieval quality by cutoff</p><p className="mt-1 text-xs text-secondary">Illustrative evaluation data for this interface demo.</p></div>
            <div className="metric-chart" role="img" aria-label="Precision and recall by retrieval cutoff">
              {metrics.map((metric) => <div className="metric-column" key={metric.k}>
                <div className="metric-bars"><i style={{ height: `${metric.precision}%` }} title={`Precision ${metric.precision}%`} /><i style={{ height: `${metric.recall}%` }} title={`Recall ${metric.recall}%`} /></div>
                <b>{metric.k}</b><span>{metric.precision} / {metric.recall}</span>
              </div>)}
            </div>
            <div className="metric-legend"><span><i /> Precision</span><span><i /> Recall</span></div>
          </Tabs.Content>

          <Tabs.Content value="documents" className="lab-panel min-h-[360px] p-5">
            <div className="grid gap-5 md:grid-cols-[240px_1fr]">
              <label className="document-drop"><Upload size={22}/><span className="font-semibold text-white">Add a PDF</span><span className="text-xs text-secondary">Preview stays in your browser</span><input type="file" accept="application/pdf" onChange={handlePdf} className="sr-only" /></label>
              <div className="pdf-stage">{pdfUrl ? <object data={pdfUrl} type="application/pdf" aria-label="Selected PDF preview"><a href={pdfUrl} target="_blank" rel="noreferrer">Open the selected PDF</a></object> : <div className="text-center"><FileText className="mx-auto mb-3 text-[#7dd3c7]"/><p className="text-sm text-secondary">Select a PDF to inspect page one.</p></div>}</div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="assistant" className="lab-panel min-h-[360px] p-5 md:p-8">
            <div className="mx-auto max-w-2xl">
              <div className="mb-6 flex items-start gap-3"><div className="assistant-avatar"><Bot size={18}/></div><p key={assistantReply.id} className="assistant-bubble">{assistantReply.text}</p></div>
              <div className="assistant-prompts">{["Compare precision and recall", "Which result is fastest?", "Explain the top match"].map(prompt => <button key={prompt} onClick={() => setMessage(prompt)}>{prompt}</button>)}</div>
              <div className="flex flex-col gap-2 sm:flex-row"><input value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && askAssistant()} placeholder="Ask about these results…" className="form-field h-11 min-w-0 flex-1 rounded-xl px-4 text-sm text-white outline-none"/><Button disabled={assistantBusy} className="w-full sm:w-auto" onClick={askAssistant}>{assistantBusy ? "Reasoning…" : "Ask backend"}</Button></div>
              <p className="mt-3 text-xs text-secondary">Server-grounded response using the active retrieval evaluation dataset.</p>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </>
  );
};

export default SectionWrapper(Workbench, "lab");
