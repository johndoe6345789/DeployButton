"use client";

import { useTranslations } from "next-intl";
import Button from "@mui/material/Button";
import styles from "./ModalFooter.module.scss";

export function ModalFooter({
  onCancel,
  submitting,
  submitLabel,
  submittingLabel,
}: {
  onCancel: () => void;
  submitting: boolean;
  submitLabel?: string;
  submittingLabel?: string;
}) {
  const t = useTranslations("common");

  return (
    <div className={styles.footer}>
      <Button
        type="button"
        onClick={onCancel}
        color="inherit"
        data-testid="modal-cancel"
      >
        {t("cancel")}
      </Button>
      <Button
        type="submit"
        variant="contained"
        disabled={submitting}
        data-testid="modal-submit"
      >
        {submitting
          ? (submittingLabel ?? t("creating"))
          : (submitLabel ?? t("create"))}
      </Button>
    </div>
  );
}
