"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import Anser from "anser";
import styles from "./AnsiOutput.module.scss";

const DECORATION_STYLE: Record<string, CSSProperties> = {
  bold: { fontWeight: 700 },
  dim: { opacity: 0.6 },
  italic: { fontStyle: "italic" },
  underline: { textDecoration: "underline" },
  strikethrough: { textDecoration: "line-through" },
};

export default function AnsiOutput({ text }: { text: string }) {
  const ref = useRef<HTMLPreElement>(null);

  // Keep pinned to the latest line as new output streams in from polling.
  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [text]);

  const chunks = Anser.ansiToJson(text, {
    use_classes: false,
    remove_empty: true,
  });

  return (
    <pre ref={ref} className={styles.output} data-testid="ansi-output">
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
    </pre>
  );
}
