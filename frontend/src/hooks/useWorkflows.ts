"use client";

import { useEffect, useState } from "react";
import { api } from "@/api/client";
import type { Workflow } from "@/types";

export function useWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    api
      .listWorkflows()
      .then(setWorkflows)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }

  function refresh() {
    setLoading(true);
    setError(null);
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return { workflows, loading, error, refresh };
}
