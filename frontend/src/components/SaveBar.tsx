"use client";

import { useTranslations } from "next-intl";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import styles from "./SaveBar.module.scss";

export default function SaveBar({
  saving,
  saved,
  error,
  onSave,
  onDone,
}: {
  saving: boolean;
  saved: boolean;
  error: string | null;
  onSave: () => void;
  onDone: () => void;
}) {
  const t = useTranslations("common");

  return (
    <div className={styles.bar}>
      <Button
        variant="contained"
        onClick={onSave}
        disabled={saving}
        data-testid="save-workflow-button"
      >
        {saving ? t("saving") : t("save")}
      </Button>
      {saved && (
        <Typography
          variant="body2"
          color="success.main"
          data-testid="save-success"
        >
          {t("saved")}
        </Typography>
      )}
      {error && (
        <Typography variant="body2" color="error" data-testid="save-error">
          {error}
        </Typography>
      )}
      <Button color="inherit" onClick={onDone} data-testid="done-button">
        {t("done")}
      </Button>
    </div>
  );
}
