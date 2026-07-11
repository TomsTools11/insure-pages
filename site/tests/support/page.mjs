import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "dist");
export const page = (p = "index.html") => readFileSync(join(dist, p), "utf-8");
