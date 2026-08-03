"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { api } from "@/api/client";
import styles from "./DeployButton.module.scss";

export default function DeployButton({ projectId }: { projectId: number }) {
  const t = useTranslations("deployButton");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const { runId } = await api.deploy(projectId);
      router.push(`/runs/${runId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("failed"));
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <Button
        variant="contained"
        onClick={handleClick}
        disabled={loading}
        data-testid="deploy-button"
      >
        {loading ? t("deploying") : t("deploy")}
      </Button>
      {error && (
        <Typography
          variant="caption"
          color="error"
          className={styles.error}
          data-testid="deploy-error"
        >
          {error}
        </Typography>
      )}
    </div>
  );
}
