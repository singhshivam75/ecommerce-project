import { useState, useRef } from 'react';
import toast from 'react-hot-toast';

type MutateFn<TData, TVariables> = (vars: TVariables) => Promise<TData>;

export function useOptimisticMutation<TData, TVariables>(mutateFn: MutateFn<TData, TVariables>) {
  const [loading, setLoading] = useState(false);
  const rollbackRef = useRef<() => void>(() => {});

  const mutate = async (vars: TVariables, optimisticUpdate?: () => void, rollback?: () => void) => {
    try {
      optimisticUpdate && optimisticUpdate();
      rollbackRef.current = rollback || (() => {});
      setLoading(true);
      const res = await mutateFn(vars);
      setLoading(false);
      return res;
    } catch (err) {
      setLoading(false);
      try { rollbackRef.current(); } catch (e) {}
      toast.error('Action failed. Changes reverted.');
      throw err;
    }
  };

  return { mutate, loading };
}
