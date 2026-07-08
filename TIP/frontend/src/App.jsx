import { useCurrentPage } from "./hooks/useCurrentPage";
import { AppLayout } from "./layouts/AppLayout";

export function App() {
  const { currentPage, page, setCurrentPage } = useCurrentPage();

  return <AppLayout currentPage={currentPage} page={page} onNavigate={setCurrentPage} />;
}
