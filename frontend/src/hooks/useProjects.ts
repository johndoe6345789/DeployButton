"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { api } from "@/api/client";
import type { Project } from "@/types";

export function useProjects() {
  const t = useTranslations("common");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    api
      .listProjects()
      .then(setProjects)
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

  return { projects, loading, error, refresh };
}
