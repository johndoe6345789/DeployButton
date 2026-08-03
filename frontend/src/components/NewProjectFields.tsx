"use client";

import { useTranslations } from "next-intl";
import TextField from "@mui/material/TextField";
import type { useCreateProjectForm } from "@/hooks/useCreateProjectForm";

type Form = ReturnType<typeof useCreateProjectForm>;

export default function NewProjectFields({ form }: { form: Form }) {
  const t = useTranslations("newProjectModal");

  return (
    <>
      <TextField
        id="new-project-name"
        label={t("name")}
        slotProps={{ htmlInput: { required: true } }}
        value={form.name}
        onChange={(e) => form.setName(e.target.value)}
      />
      <TextField
        id="new-project-slug"
        label={t("slug")}
        slotProps={{ htmlInput: { required: true } }}
        value={form.slug}
        onChange={(e) => form.setSlug(e.target.value)}
        placeholder={t("slugPlaceholder")}
      />
      <TextField
        id="new-project-repo-url"
        label={t("repoUrl")}
        value={form.repoUrl}
        onChange={(e) => form.setRepoUrl(e.target.value)}
        placeholder={t("repoUrlPlaceholder")}
      />
      <TextField
        id="new-project-workflow"
        select
        slotProps={{ select: { native: true } }}
        label={t("workflow")}
        value={form.workflowId ?? ""}
        onChange={(e) => form.setWorkflowId(Number(e.target.value))}
      >
        {form.workflows.map((w) => (
          <option key={w.id} value={w.id}>
            {w.name}
          </option>
        ))}
      </TextField>
    </>
  );
}
