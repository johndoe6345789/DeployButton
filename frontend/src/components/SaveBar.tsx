"use client";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

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
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ alignItems: "center", flexWrap: "wrap", mt: 3 }}
    >
      <Button variant="contained" onClick={onSave} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
      {saved && (
        <Typography variant="body2" color="success.main">
          Saved.
        </Typography>
      )}
      {error && (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      )}
      <Button color="inherit" onClick={onDone}>
        Done
      </Button>
    </Stack>
  );
}
