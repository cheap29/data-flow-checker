import type { DataFlow } from "@/lib/types";
import { ResultSection } from "./ResultSection";

export function DataFlowView({ dataFlows }: { dataFlows: DataFlow[] }) {
  return (
    <ResultSection title="データの流れ" empty={dataFlows.length === 0}>
      <div className="space-y-4">
        {dataFlows.map((flow, i) => (
          <div key={i}>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">{flow.title}</h3>
            <ol className="space-y-1">
              {flow.steps.map((step, j) => (
                <li key={j} className="flex gap-2 text-sm text-gray-700">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                    {j + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </ResultSection>
  );
}
