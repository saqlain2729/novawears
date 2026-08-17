export function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`border border-line-light p-5 ${accent ? "bg-ink text-paper border-ink" : "bg-paper"}`}>
      <p className={`text-[11px] tracking-widest2 uppercase mb-2 ${accent ? "text-silver-dark" : "text-silver-dark"}`}>{label}</p>
      <p className="text-2xl font-display">{value}</p>
    </div>
  );
}

export function AdminPageHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-8 py-6 border-b border-line-light">
      <h1 className="font-display text-2xl tracking-tight">{title}</h1>
      {action}
    </div>
  );
}
