import { BrandMark } from "../components/BrandMark";
import { navigationItems } from "../config/navigation";

export function Sidebar({ currentPage, onNavigate }) {
  return (
    <aside className="flex min-h-screen w-full flex-col border-r border-slate-800 bg-tip-panel p-4 lg:w-72">
      <BrandMark />
      <nav className="mt-8 space-y-1">
        {navigationItems.map((item) => {
          const active = item.path === currentPage;
          return (
            <button
              key={item.path}
              className={`w-full rounded px-3 py-3 text-left text-sm transition ${
                active
                  ? "bg-tip-accent text-tip-background"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
              onClick={() => onNavigate(item.path)}
              type="button"
            >
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="mt-auto rounded border border-slate-800 bg-tip-background p-3 text-xs text-slate-400">
        Local-first internal platform. No SaaS, billing, or public registration.
      </div>
    </aside>
  );
}
