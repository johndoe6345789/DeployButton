"use client";

import Link from "next/link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import type { Workflow } from "@/types";

export default function WorkflowListItem({
  workflow,
  onDelete,
}: {
  workflow: Workflow;
  onDelete: () => void;
}) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{
            alignItems: { sm: "center" },
            justifyContent: { sm: "space-between" },
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: "center", flexWrap: "wrap" }}
            >
              <Typography
                component={Link}
                href={`/workflows/${workflow.id}`}
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  textDecoration: "none",
                }}
              >
                {workflow.name}
              </Typography>
              {workflow.is_template && <Chip size="small" label="Template" />}
            </Stack>
            {workflow.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {workflow.description}
              </Typography>
            )}
          </Box>
          <Button
            size="small"
            color="error"
            onClick={onDelete}
            sx={{ alignSelf: { xs: "flex-start", sm: "auto" } }}
          >
            Delete
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
