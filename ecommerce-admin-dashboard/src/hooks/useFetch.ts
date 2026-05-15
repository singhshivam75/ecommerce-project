import { useState, useEffect, useCallback } from "react";
import api from "../lib/api";

export function useFetch<T = any>(
  url: string | null,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(async () => {
    if (!url) return;

    setLoading(true);

    try {
      const res = await api.get(url);
      setData(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...deps]);

  return {
    data,
    loading,
    error,
    refetch: fetchData, // ✅ FIXED
  };
}