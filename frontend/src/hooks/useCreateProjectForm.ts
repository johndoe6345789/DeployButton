"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { api } from "@/api/client";
import type { Project, Workflow } from "@/types";

export function useCreateProjectForm(onCreated: (project: Project) => void) {
  const t = useTranslations("newProjectModal");
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [workflowId, setWorkflowId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .listWorkflows()
      .then((list) => {
        setWorkflows(list);
        if (list.length > 0) setWorkflowId(list[0].id);
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : t("failedToLoad")),
      );
  }, [t]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!workflowId) {
      setError(t("chooseWorkflow"));
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const project = await api.createProject({
        name,
        slug,
        repo_url: repoUrl,
        workflow_id: workflowId,
      });
      onCreated(project);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("failedToCreate"));
      setSubmitting(false);
    }
  }

  return {
    workflows,
    name,
    setName,
    slug,
    setSlug,
    repoUrl,
    setRepoUrl,
    workflowId,
    setWorkflowId,
    error,
    submitting,
    submit,
  };
}
