import { useState, useEffect, useCallback } from "react";
import { fetchAutomations } from "../services/api";

/**
 * useAutomations - Custom hook for fetching and managing automation actions
 */
export function useAutomations() {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAutomations();
      setAutomations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const getAutomation = useCallback(
    id => {
      return automations.find(a => a.id === id);
    },
    [automations]
  );

  const getAutomationParams = useCallback(
    id => {
      const automation = getAutomation(id);
      return automation?.params || [];
    },
    [getAutomation]
  );

  return {
    automations,
    loading,
    error,
    reload: load,
    getAutomation,
    getAutomationParams,
  };
}

export default useAutomations;
