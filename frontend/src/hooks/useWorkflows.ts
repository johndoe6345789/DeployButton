"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { api } from "@/api/client";
import type { Workflow } from "@/types";

export function useWorkflows() {
  const t = useTranslations("common");
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    api
      .listWorkflows()
      .then(setWorkflows)
      .catch((e) =>
        setError(e instanceof Error ? e.message : t("failedToLoad")),
      )
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
