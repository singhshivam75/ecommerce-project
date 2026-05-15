// hooks/useTableQuery.ts

import { useState } from "react";

export function useTableQuery(initial = {}) {
  const [query, setQuery] = useState({
    page: 1,
    limit: 6,
    search: "",
    ...initial,
  });

  const updateQuery = (newValues: any) => {
    setQuery((prev) => ({
      ...prev,
      ...newValues,
    }));
  };

  return {
    query,
    setQuery: updateQuery,
  };
}