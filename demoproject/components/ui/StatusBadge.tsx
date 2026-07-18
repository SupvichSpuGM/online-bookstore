// Server Component — pure display
import { statusCfg } from "@/lib/data";

export function StatusBadge({ status }: { status: string }) {
  const cfg = statusCfg[status] ?? {
    label: status,
    color: "text-gray-600 bg-gray-50 border-gray-200",
    dot: "bg-gray-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
