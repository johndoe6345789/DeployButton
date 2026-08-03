"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { api } from "@/api/client";
import PageContainer from "@/components/PageContainer";
import WorkflowsListHeader from "@/components/WorkflowsListHeader";
import WorkflowListItem from "@/components/WorkflowListItem";
import { useWorkflows } from "@/hooks/useWorkflows";

export default function WorkflowList() {
  const t = useTranslations("workflowsList");
  const tc = useTranslations("common");
  const router = useRouter();
  const { workflows, loading, error, refresh } = useWorkflows();

  async function handleCreate() {
    const workflow = await api.createWorkflow({
      name: t("defaultWorkflowName"),
      description: "",
    });
    router.push(`/workflows/${workflow.id}`);
  }

  async function handleDelete(id: number) {
    if (!confirm(t("confirmDelete"))) return;
    await api.deleteWorkflow(id);
    refresh();
  }

  return (
    <PageContainer>
      <WorkflowsListHeader onCreate={handleCreate} />

      {loading && (
        <Typography variant="body2" color="text.secondary">
          {tc("loading")}
        </Typography>
      )}
      {error && (
        <Typography variant="body2" color="error" data-testid="workflows-error">
          {error}
        </Typography>
      )}

      <Stack spacing={1.5} data-testid="workflow-list">
        {workflows.map((w) => (
          <WorkflowListItem
            key={w.id}
            workflow={w}
            onDelete={() => handleDelete(w.id)}
          />
        ))}
      </Stack>
    </PageContainer>
  );
}
