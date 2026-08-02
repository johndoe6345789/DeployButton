"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Typography from "@mui/material/Typography";
import PageContainer from "@/components/PageContainer";
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
      <PageContainer>
        <Typography variant="body2" color="text.secondary">
          Loading...
        </Typography>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Typography
        component={Link}
        href="/workflows"
        variant="body2"
        sx={{ color: "primary.main" }}
      >
        &larr; Back to workflows
      </Typography>

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
    </PageContainer>
  );
}
