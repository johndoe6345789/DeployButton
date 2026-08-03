"use client";

import { useTranslations } from "next-intl";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import { ModalFooter } from "./ModalFooter";
import NewProjectFields from "./NewProjectFields";
import { useCreateProjectForm } from "@/hooks/useCreateProjectForm";
import type { Project } from "@/types";
import styles from "./NewProjectModal.module.scss";

export default function NewProjectModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (project: Project) => void;
}) {
  const t = useTranslations("newProjectModal");
  const form = useCreateProjectForm(onCreated);

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{t("title")}</DialogTitle>
      <DialogContent>
        <form
          onSubmit={form.submit}
          className={styles.form}
          data-testid="new-project-form"
        >
          <NewProjectFields form={form} />

          {form.error && (
            <Typography
              variant="body2"
              color="error"
              data-testid="new-project-error"
            >
              {form.error}
            </Typography>
          )}

          <ModalFooter onCancel={onClose} submitting={form.submitting} />
        </form>
      </DialogContent>
    </Dialog>
  );
}
