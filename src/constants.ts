import { dirName } from "isaacscript-common-node";
import path from "node:path";

const __dirname = dirName();

export const REPO_ROOT = path.join(__dirname, "..");
