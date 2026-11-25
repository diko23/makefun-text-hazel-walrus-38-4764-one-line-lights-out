import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_CHARS = 200;

const ENTRY_LINE: string =
  "Session idle: lid closed. Keeping today's context loaded for a follow-up that usually opens in a new tab.";

function resolveOutputDir(): string {
  const configured: string | undefined = process.env.MAKEFUN_OUTPUT_DIR;
  return configured && configured.trim().length > 0 ? configured.trim() : "/output";
}

function main(): void {
  const charCount: number = [...ENTRY_LINE].length;
  if (ENTRY_LINE.trim().length === 0 || charCount > MAX_CHARS) {
    throw new Error(`Invalid entry length: ${charCount}`);
  }

  const outputDir: string = resolveOutputDir();
  const outputPath: string = join(outputDir, "entry.txt");

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(outputPath, ENTRY_LINE, { encoding: "utf8" });
  chmodSync(outputPath, 0o644);
}

try {
  main();
} catch (err: unknown) {
  const message: string = err instanceof Error ? err.message : String(err);
  process.stderr.write(`Failed to write entry: ${message}\n`);
  process.exit(1);
}
