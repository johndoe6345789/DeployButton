"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { api } from "@/api/client";
import type { EditableStep } from "@/types";
import StepCard from "@/components/StepCard";
import AddStepMenu from "@/components/AddStepMenu";

export default function WorkflowEditor() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const workflowId = Number(params.id);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<EditableStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

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

  if (loading) {
    return <div className="mx-auto max-w-3xl px-6 py-10 text-sm text-gray-500">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/workflows" className="text-sm text-indigo-600 hover:underline">
        &larr; Back to workflows
      </Link>

      <div className="mt-4 flex flex-col gap-2">
        <input
          className="rounded-md border border-black/20 px-2 py-1 text-xl font-bold dark:border-white/20 dark:bg-neutral-800"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          className="rounded-md border border-black/20 px-2 py-1 text-sm dark:border-white/20 dark:bg-neutral-800"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="Description"
        />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Steps</h2>
        <AddStepMenu
          onAdd={(step) => setSteps((prev) => [...prev, step])}
        />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={steps.map((s) => s.key)}
          strategy={verticalListSortingStrategy}
        >
          <div className="mt-3 flex flex-col gap-2">
            {steps.map((step) => (
              <StepCard
                key={step.key}
                step={step}
                onChange={(updated) =>
                  setSteps((prev) =>
                    prev.map((s) => (s.key === step.key ? updated : s)),
                  )
                }
                onRemove={() =>
                  setSteps((prev) => prev.filter((s) => s.key !== step.key))
                }
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {steps.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">
          No steps yet. Add one above.
        </p>
      )}

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        {saved && <span className="text-sm text-green-600">Saved.</span>}
        {error && <span className="text-sm text-red-600">{error}</span>}
        <button
          onClick={() => router.push("/workflows")}
          className="text-sm text-gray-500 hover:underline"
        >
          Done
        </button>
      </div>
    </div>
  );
}
