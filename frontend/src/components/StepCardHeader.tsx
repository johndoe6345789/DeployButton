"use client";

import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import type { EditableStep } from "@/types";

export default function StepCardHeader({
  step,
  typeLabel,
  expanded,
  onNameChange,
  onToggleExpanded,
  onRemove,
  dragHandleProps,
}: {
  step: EditableStep;
  typeLabel: string;
  expanded: boolean;
  onNameChange: (name: string) => void;
  onToggleExpanded: () => void;
  onRemove: () => void;
  dragHandleProps: Record<string, unknown>;
}) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1}
      sx={{ alignItems: { sm: "center" }, p: 1 }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: "center", flex: 1 }}
      >
        <IconButton
          {...dragHandleProps}
          size="small"
          aria-label="Drag to reorder"
        >
          <DragIndicatorIcon fontSize="small" />
        </IconButton>
        <TextField
          size="small"
          variant="standard"
          fullWidth
          value={step.name}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </Stack>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: "center",
          flexWrap: "wrap",
          pl: { xs: 5, sm: 0 },
        }}
      >
        <Chip size="small" label={typeLabel} />
        <Button size="small" onClick={onToggleExpanded}>
          {expanded ? "Collapse" : "Configure"}
        </Button>
        <Button size="small" color="error" onClick={onRemove}>
          Remove
        </Button>
      </Stack>
    </Stack>
  );
}
