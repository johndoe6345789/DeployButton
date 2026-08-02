"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function WorkflowsListHeader({
  onCreate,
}: {
  onCreate: () => void;
}) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{
        mb: 3,
        alignItems: { sm: "center" },
        justifyContent: { sm: "space-between" },
      }}
    >
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Workflows
        </Typography>
        <Typography
          component={Link}
          href="/"
          variant="body2"
          sx={{ color: "primary.main" }}
        >
          &larr; Back to dashboard
        </Typography>
      </Box>
      <Button
        variant="contained"
        onClick={onCreate}
        sx={{ alignSelf: { xs: "flex-start", sm: "auto" } }}
      >
        New Workflow
      </Button>
    </Stack>
  );
}
