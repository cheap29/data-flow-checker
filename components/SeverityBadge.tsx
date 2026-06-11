import type { Severity } from "@/lib/types";

const config: Record<Severity, { label: string; className: string }> = {
  high: { label: "高", className: "bg-red-100 text-red-700 border border-red-300" },
  medium: { label: "中", className: "bg-yellow-100 text-yellow-700 border border-yellow-300" },
  low: { label: "低", className: "bg-green-100 text-green-700 border border-green-300" },
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  const { label, className } = config[severity];
  return (
    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded ${className}`}>
      {label}
    </span>
  );
}
