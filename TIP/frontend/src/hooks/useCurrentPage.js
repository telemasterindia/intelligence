import { useMemo, useState } from "react";
import { pages } from "../config/pages";

export function useCurrentPage() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const page = useMemo(() => pages[currentPage] || pages.dashboard, [currentPage]);

  return { currentPage, page, setCurrentPage };
}
