"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ModalFooter } from "./ModalFooter";
import { useCreateProjectForm } from "@/hooks/useCreateProjectForm";
import type { Project } from "@/types";

export default function NewProjectModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (project: Project) => void;
}) {
  const form = useCreateProjectForm(onCreated);

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>New Project</DialogTitle>
      <DialogContent>
        <Stack
          component="form"
          onSubmit={form.submit}
          spacing={2}
          sx={{ mt: 0.5 }}
        >
          <TextField
            id="new-project-name"
            label="Name"
            slotProps={{ htmlInput: { required: true } }}
            value={form.name}
            onChange={(e) => form.setName(e.target.value)}
          />
          <TextField
            id="new-project-slug"
            label="Slug (used in the webhook URL)"
            slotProps={{ htmlInput: { required: true } }}
            value={form.slug}
            onChange={(e) => form.setSlug(e.target.value)}
            placeholder="my-app"
          />
          <TextField
            id="new-project-repo-url"
            label="Repo URL"
            value={form.repoUrl}
            onChange={(e) => form.setRepoUrl(e.target.value)}
            placeholder="github.com/you/my-app"
          />
          <TextField
            id="new-project-workflow"
            select
            slotProps={{ select: { native: true } }}
            label="Workflow"
            value={form.workflowId ?? ""}
            onChange={(e) => form.setWorkflowId(Number(e.target.value))}
          >
            {form.workflows.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </TextField>

          {form.error && (
            <Typography variant="body2" color="error">
              {form.error}
            </Typography>
          )}

          <ModalFooter onCancel={onClose} submitting={form.submitting} />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
