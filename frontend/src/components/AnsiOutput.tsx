"use client";

import { memo } from "react";
import type { CSSProperties } from "react";
import Anser from "anser";

const DECORATION_STYLE: Record<string, CSSProperties> = {
  bold: { fontWeight: 700 },
  dim: { opacity: 0.6 },
  italic: { fontStyle: "italic" },
  underline: { textDecoration: "underline" },
  strikethrough: { textDecoration: "line-through" },
};

// Renders one immutable fragment of ANSI-coded output as a run of styled
// spans. Deliberately has no wrapping element or scroll behavior of its own
// -- StepOutputViewer owns the single scrollable container and stacks
// fragments inside it, so each fragment here only ever gets ANSI-parsed
// once (memoized), never re-parsed as sibling fragments come and go.
function AnsiOutput({ text }: { text: string }) {
  const chunks = Anser.ansiToJson(text, {
    use_classes: false,
    remove_empty: true,
  });

  return (
    <>
      {chunks.map((chunk, i) => (
        <span
          key={i}
          style={{
            color: chunk.fg ? `rgb(${chunk.fg})` : undefined,
            backgroundColor: chunk.bg ? `rgb(${chunk.bg})` : undefined,
            ...chunk.decorations.reduce<CSSProperties>(
              (acc, decoration) => ({
                ...acc,
                ...DECORATION_STYLE[decoration],
              }),
              {},
            ),
          }}
        >
          {chunk.content}
        </span>
      ))}
    </>
  );
}

export default memo(AnsiOutput);
