"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { api } from "@/api/client";
import type { Workflow } from "@/types";

export function useWorkflows() {
  const t = useTranslations("common");
  const failedToLoadMessage = t("failedToLoad");
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    api
      .listWorkflows()
      .then(setWorkflows)
      .catch((e) =>
        setError(e instanceof Error ? e.message : failedToLoadMessage),
      )
      .finally(() => setLoading(false));
  }, [failedToLoadMessage]);

  function refresh() {
    setLoading(true);
    setError(null);
    load();
  }

  useEffect(() => {
    load();
  }, [load]);

  return { workflows, loading, error, refresh };
}
