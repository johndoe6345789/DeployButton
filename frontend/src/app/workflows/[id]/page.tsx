"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import WorkflowEditorHeader from "@/components/WorkflowEditorHeader";
import StepsList from "@/components/StepsList";
import SaveBar from "@/components/SaveBar";
import { useWorkflowEditor } from "@/hooks/useWorkflowEditor";
import type { EditableStep } from "@/types";

export default function WorkflowEditor() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const workflowId = Number(params.id);
  const editor = useWorkflowEditor(workflowId);

  function updateStep(key: string, updated: EditableStep) {
    editor.setSteps((prev) => prev.map((s) => (s.key === key ? updated : s)));
  }

  function removeStep(key: string) {
    editor.setSteps((prev) => prev.filter((s) => s.key !== key));
  }

  if (editor.loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-sm text-gray-500 sm:px-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/workflows"
        className="text-sm text-indigo-600 hover:underline"
      >
        &larr; Back to workflows
      </Link>

      <WorkflowEditorHeader
        name={editor.name}
        onNameChange={editor.setName}
        description={editor.description}
        onDescriptionChange={editor.setDescription}
        onAddStep={(step) => editor.setSteps((prev) => [...prev, step])}
      />

      <StepsList
        steps={editor.steps}
        onDragEnd={editor.handleDragEnd}
        onChangeStep={updateStep}
        onRemoveStep={removeStep}
      />

      <SaveBar
        saving={editor.saving}
        saved={editor.saved}
        error={editor.error}
        onSave={editor.handleSave}
        onDone={() => router.push("/workflows")}
      />
    </div>
  );
}
