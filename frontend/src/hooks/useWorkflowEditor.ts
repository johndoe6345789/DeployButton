"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { DragEndEvent } from "@dnd-kit/core";
import { api } from "@/api/client";
import type { EditableStep } from "@/types";
import {
  errorMessage,
  reorderOnDragEnd,
  toEditableSteps,
} from "./workflowEditorHelpers";

export function useWorkflowEditor(workflowId: number) {
  const tCommon = useTranslations("common");
  const tEditor = useTranslations("workflowEditor");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<EditableStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api
      .getWorkflow(workflowId)
      .then((workflow) => {
        setName(workflow.name);
        setDescription(workflow.description ?? "");
        setSteps(toEditableSteps(workflow.steps));
      })
      .catch((e) => setError(errorMessage(e, tCommon("failedToLoad"))))
      .finally(() => setLoading(false));
  }, [workflowId]);

  function handleDragEnd(event: DragEndEvent) {
    setSteps((items) => reorderOnDragEnd(items, event));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await api.updateWorkflow(workflowId, { name, description });
      await api.updateWorkflowSteps(
        workflowId,
        steps.map((s) => ({ name: s.name, type: s.type, config: s.config })),
      );
      setSaved(true);
    } catch (e) {
      setError(errorMessage(e, tEditor("failedToSave")));
    } finally {
      setSaving(false);
    }
  }

  return {
    name,
    setName,
    description,
    setDescription,
    steps,
    setSteps,
    loading,
    saving,
    error,
    saved,
    handleDragEnd,
    handleSave,
  };
}
