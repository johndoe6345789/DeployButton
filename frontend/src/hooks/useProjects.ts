"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { api } from "@/api/client";
import type { Project } from "@/types";

export function useProjects() {
  const t = useTranslations("common");
  const failedToLoadMessage = t("failedToLoad");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    api
      .listProjects()
      .then(setProjects)
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

  return { projects, loading, error, refresh };
}
