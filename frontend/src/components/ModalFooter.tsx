"use client";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

export function ModalFooter({
  onCancel,
  submitting,
  submitLabel = "Create",
  submittingLabel = "Creating...",
}: {
  onCancel: () => void;
  submitting: boolean;
  submitLabel?: string;
  submittingLabel?: string;
}) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ justifyContent: "flex-end", mt: 1 }}
    >
      <Button type="button" onClick={onCancel} color="inherit">
        Cancel
      </Button>
      <Button type="submit" variant="contained" disabled={submitting}>
        {submitting ? submittingLabel : submitLabel}
      </Button>
    </Stack>
  );
}
