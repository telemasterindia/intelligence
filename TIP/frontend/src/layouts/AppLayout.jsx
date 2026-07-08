import { PagePlaceholder } from "../components/PagePlaceholder";
import { ImportLeadsPage } from "../pages/ImportLeadsPage";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

export function AppLayout({ currentPage, page, onNavigate }) {
  return (
    <div className="min-h-screen bg-tip-background text-slate-100 lg:grid lg:grid-cols-[18rem_1fr]">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      <main className="min-w-0">
        <TopNav pageTitle={page.title} />
        <div className="p-4 sm:p-6 lg:p-8">
          {currentPage === "import-leads" ? (
            <ImportLeadsPage />
          ) : (
            <PagePlaceholder title={page.title} purpose={page.purpose} />
          )}
        </div>
      </main>
    </div>
  );
}
