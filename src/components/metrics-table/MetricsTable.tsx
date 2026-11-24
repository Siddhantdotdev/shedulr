"use client";
import { useSimulationStore } from "@/store/simulation-store";

export function MetricsTable() {
  const { result, processes } = useSimulationStore();
  if (!result) return <div className="text-xs text-muted-foreground border border-border rounded-md p-4">Run a simulation to see metrics</div>;

  const processMap = new Map(processes.map(p => [p.id, p]));
  return (
    <div className="space-y-3">
      <div className="border border-border rounded-md overflow-hidden text-xs">
        <table className="w-full">
          <thead className="bg-muted/50"><tr><th className="p-2 text-left">PID</th><th className="p-2 text-left">AT</th><th className="p-2 text-left">BT</th><th className="p-2 text-left">CT</th><th className="p-2 text-left">TAT</th><th className="p-2 text-left">WT</th><th className="p-2 text-left">RT</th></tr></thead>
          <tbody>
            {result.metrics.map(m => {
              const p = processMap.get(m.pid);
              return (
                <tr key={m.pid} className="border-t border-border">
                  <td className="p-2 font-medium">{m.pid}</td>
                  <td className="p-2">{p?.arrival}</td>
                  <td className="p-2">{p?.burst}</td>
                  <td className="p-2">{m.ct}</td>
                  <td className="p-2">{m.tat}</td>
                  <td className="p-2">{m.wt}</td>
                  <td className="p-2">{m.rt}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
        <div className="border border-border rounded px-2 py-1.5"><div className="text-muted-foreground">Avg WT</div><div className="font-medium">{result.averages.wt.toFixed(2)}</div></div>
        <div className="border border-border rounded px-2 py-1.5"><div className="text-muted-foreground">Avg TAT</div><div className="font-medium">{result.averages.tat.toFixed(2)}</div></div>
        <div className="border border-border rounded px-2 py-1.5"><div className="text-muted-foreground">Avg RT</div><div className="font-medium">{result.averages.rt.toFixed(2)}</div></div>
        <div className="border border-border rounded px-2 py-1.5"><div className="text-muted-foreground">CPU Util</div><div className="font-medium">{result.averages.utilization.toFixed(1)}%</div></div>
        <div className="border border-border rounded px-2 py-1.5"><div className="text-muted-foreground">Throughput</div><div className="font-medium">{result.averages.throughput.toFixed(3)}</div></div>
      </div>
    </div>
  );
}
