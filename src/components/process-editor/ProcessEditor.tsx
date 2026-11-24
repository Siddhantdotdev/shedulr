"use client";
import { useSimulationStore } from "@/store/simulation-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

export function ProcessEditor() {
  const { processes, addProcess, updateProcess, removeProcess } = useSimulationStore();
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-medium">Processes</h2>
        <Button size="sm" variant="outline" onClick={addProcess}><Plus className="h-3.5 w-3.5" /></Button>
      </div>
      <div className="border border-border rounded-md overflow-hidden text-xs">
        <table className="w-full">
          <thead className="bg-muted/50"><tr><th className="p-2 text-left">PID</th><th className="p-2 text-left">Arrival</th><th className="p-2 text-left">Burst</th><th className="p-2 text-left">Priority</th><th /></tr></thead>
          <tbody>
            {processes.map((p, i) => (
              <tr key={i} className="border-t border-border">
                <td className="p-1"><Input value={p.id} onChange={e => updateProcess(i, { id: e.target.value })} className="h-7 text-xs" /></td>
                <td className="p-1"><Input type="number" value={p.arrival} onChange={e => updateProcess(i, { arrival: +e.target.value })} className="h-7 text-xs" /></td>
                <td className="p-1"><Input type="number" value={p.burst} onChange={e => updateProcess(i, { burst: +e.target.value })} className="h-7 text-xs" /></td>
                <td className="p-1"><Input type="number" value={p.priority} onChange={e => updateProcess(i, { priority: +e.target.value })} className="h-7 text-xs" /></td>
                <td className="p-1"><Button size="sm" variant="ghost" onClick={() => removeProcess(i)}><Trash2 className="h-3.5 w-3.5" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
