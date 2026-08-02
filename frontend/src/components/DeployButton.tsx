"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { api } from "@/api/client";

export default function DeployButton({ projectId }: { projectId: number }) {
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
      setError(e instanceof Error ? e.message : "Deploy failed");
      setLoading(false);
    }
  }

  return (
    <Stack spacing={0.5} sx={{ alignItems: "flex-end" }}>
      <Button variant="contained" onClick={handleClick} disabled={loading}>
        {loading ? "Deploying..." : "Deploy"}
      </Button>
      {error && (
        <Typography
          variant="caption"
          color="error"
          sx={{ textAlign: "right", maxWidth: 240 }}
        >
          {error}
        </Typography>
      )}
    </Stack>
  );
}
