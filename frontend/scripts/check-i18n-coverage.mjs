#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.resolve(SCRIPT_DIR, "..", "src");
const THRESHOLD = 80;

// Attributes whose string-literal value is prose shown to the user, as
// opposed to plumbing like `data-testid`, `href`, `className`, or `type`.
const USER_FACING_ATTRS = new Set([
  "label",
  "placeholder",
  "title",
  "alt",
  "aria-label",
  "aria-description",
]);

function collectFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(full, out);
    } else if (entry.name.endsWith(".tsx") && !entry.name.includes(".test.")) {
      out.push(full);
    }
  }
  return out;
}

// Filters out text that isn't really translatable prose: whitespace,
// HTML entities like `&larr;`, and all-caps technical tokens like the
// HTTP method literals ("GET", "POST") rendered in a native <select>.
function isUserFacing(text) {
  const trimmed = text.trim();
  if (trimmed.length < 2) return false;
  if (/^&[a-zA-Z]+;$/.test(trimmed)) return false;
  return /[a-z]/.test(trimmed);
}

function findTranslatorNames(sourceFile) {
  const names = new Set();
  function visit(node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer &&
      ts.isCallExpression(node.initializer) &&
      ts.isIdentifier(node.initializer.expression) &&
      node.initializer.expression.text === "useTranslations"
    ) {
      names.add(node.name.text);
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return names;
}

function scanFile(file, findings) {
  const source = fs.readFileSync(file, "utf8");
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const translators = findTranslatorNames(sourceFile);
  let translated = 0;

  function report(node, text) {
    const { line } = sourceFile.getLineAndCharacterOfPosition(
      node.getStart(sourceFile),
    );
    findings.push({ file, line: line + 1, text: text.trim() });
  }

  function visit(node) {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      translators.has(node.expression.text)
    ) {
      translated += 1;
    } else if (ts.isJsxText(node) && isUserFacing(node.text)) {
      report(node, node.text);
    } else if (
      ts.isJsxAttribute(node) &&
      ts.isIdentifier(node.name) &&
      USER_FACING_ATTRS.has(node.name.text) &&
      node.initializer &&
      ts.isStringLiteral(node.initializer) &&
      isUserFacing(node.initializer.text)
    ) {
      report(node, node.initializer.text);
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return translated;
}

function main() {
  const findings = [];
  let translated = 0;
  for (const file of collectFiles(SRC_DIR)) {
    translated += scanFile(file, findings);
  }

  const total = translated + findings.length;
  const coverage = total === 0 ? 100 : (translated / total) * 100;

  if (findings.length > 0) {
    console.log("Untranslated user-facing strings:");
    for (const f of findings) {
      const rel = path.relative(SRC_DIR, f.file);
      console.log(`  ${rel}:${f.line}: "${f.text}"`);
    }
  }

  console.log(
    `i18n coverage: ${coverage.toFixed(1)}% ` +
      `(${translated}/${total} strings translated)`,
  );

  if (coverage < THRESHOLD) {
    console.error(`Coverage is below the ${THRESHOLD}% threshold.`);
    process.exit(1);
  }
}

main();
