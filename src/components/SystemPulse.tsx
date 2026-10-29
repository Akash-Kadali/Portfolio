import { useQuery } from "@tanstack/react-query";
import { Activity, Database, MessageSquareText, RadioTower } from "lucide-react";

type Status = { state: string; node: string; uptime: number; services: Record<string, string>; timestamp: string };

export default function SystemPulse() {
  const { data, isError } = useQuery<Status>({ queryKey: ["system-status"], queryFn: async () => { const response = await fetch("/api/status"); if (!response.ok) throw new Error("offline"); return response.json(); }, refetchInterval: 15_000 });
  return <section className="system-pulse" aria-label="Live platform status"><div className="pulse-title"><RadioTower size={15}/><span>PERSONAL INTELLIGENCE OS</span><b className={isError ? "offline" : ""}>{isError ? "DEGRADED" : data?.state.toUpperCase() ?? "CONNECTING"}</b></div><div className="pulse-services"><span><Database size={13}/>Retrieval <i>{data?.services.retrieval ?? "syncing"}</i></span><span><MessageSquareText size={13}/>Assistant <i>{data?.services.assistant ?? "syncing"}</i></span><span><Activity size={13}/>Node <i>{data?.node ?? "SK-ML-01"}</i></span></div><div className="pulse-uptime">SESSION / {String(data?.uptime ?? 0).padStart(4,"0")}s</div></section>;
}
