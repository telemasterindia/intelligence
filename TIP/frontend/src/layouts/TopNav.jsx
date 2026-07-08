export function TopNav({ pageTitle }) {
  return (
    <header className="flex min-h-16 items-center justify-between border-b border-slate-800 bg-tip-background px-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Version 1 Foundation</p>
        <h2 className="text-lg font-semibold text-white">{pageTitle}</h2>
      </div>
      <div className="rounded border border-slate-800 px-3 py-2 text-xs text-slate-300">
        Internal Only
      </div>
    </header>
  );
}
