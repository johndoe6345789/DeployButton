"use client";

import { useEffect, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";
import { api } from "@/api/client";
import type { EditableStep } from "@/types";

export function useWorkflowEditor(workflowId: number) {
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
        setSteps(
          workflow.steps.map((s) => ({
            key: String(s.id),
            name: s.name,
            type: s.type,
            config: s.config,
          })),
        );
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [workflowId]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSteps((items) => {
      const oldIndex = items.findIndex((i) => i.key === active.id);
      const newIndex = items.findIndex((i) => i.key === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
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
      setError(e instanceof Error ? e.message : "Failed to save");
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
