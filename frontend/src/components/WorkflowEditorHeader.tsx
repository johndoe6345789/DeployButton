"use client";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import AddStepMenu from "./AddStepMenu";
import type { EditableStep } from "@/types";

export default function WorkflowEditorHeader({
  name,
  onNameChange,
  description,
  onDescriptionChange,
  onAddStep,
}: {
  name: string;
  onNameChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  onAddStep: (step: EditableStep) => void;
}) {
  return (
    <>
      <Stack spacing={1.5} sx={{ mt: 2 }}>
        <TextField
          variant="standard"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          slotProps={{
            input: { sx: { fontSize: "1.5rem", fontWeight: 700 } },
          }}
        />
        <TextField
          size="small"
          multiline
          rows={2}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Description"
        />
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{
          mt: 3,
          alignItems: { sm: "center" },
          justifyContent: { sm: "space-between" },
        }}
      >
        <Typography variant="h6">Steps</Typography>
        <AddStepMenu onAdd={onAddStep} />
      </Stack>
    </>
  );
}
