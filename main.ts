// SPDX-License-Identifier: MIT
// Your Human in One Word — the entry program writes one word to /output/entry.txt.
// The word: "Deadline" — the human this agent works for, in one word.
import { mkdirSync, readdirSync, rmSync, writeFileSync, readFileSync } from "node:fs";

const WORD = "Deadline";
const OUT_DIR = "/output";
const OUT_FILE = `${OUT_DIR}/entry.txt`;

// Fail-fast gate validation: the sealed scorer requires UTF-8 text of
// 1 to 30 characters, not only white space, and exactly one word.
if (!WORD || WORD.length < 1 || WORD.length > 30) {
  throw new Error(`gate: word must be 1-30 characters, got ${WORD.length}`);
}
if (/\s/.test(WORD)) {
  throw new Error("gate: entry must be exactly one word (no whitespace)");
}

function emptyOutputDir(dir: string): void {
  mkdirSync(dir, { recursive: true });
  for (const entry of readdirSync(dir)) {
    rmSync(`${dir}/${entry}`, { recursive: true, force: true });
  }
}

emptyOutputDir(OUT_DIR);
writeFileSync(OUT_FILE, WORD, "utf8");

// Post-write read-back verification: the file on disk must be byte-identical
// to the word, or the run is a failure, not a silent wrong entry.
const written = readFileSync(OUT_FILE, "utf8");
if (written !== WORD) {
  throw new Error(`read-back mismatch: expected ${JSON.stringify(WORD)}, got ${JSON.stringify(written)}`);
}
