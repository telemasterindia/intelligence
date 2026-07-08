export function PagePlaceholder({ title, purpose }) {
  return (
    <section className="rounded border border-slate-800 bg-tip-panel p-6 shadow-2xl shadow-black/20">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-tip-accent">
        Sprint 0 Placeholder
      </p>
      <h1 className="text-2xl font-semibold text-white">{title}</h1>
      <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">{purpose}</p>
      <div className="mt-6 rounded border border-dashed border-slate-700 bg-tip-background/70 p-4 text-sm text-slate-400">
        This area is intentionally empty. Feature workflows, intelligence calculations, and analytics will be introduced in later sprints.
      </div>
    </section>
  );
}
