import { dirName } from "isaacscript-common-node";
import { SECOND_IN_MILLISECONDS } from "isaacscript-common-ts";
import path from "node:path";

const __dirname = dirName();

export const REPO_ROOT = path.join(__dirname, "..");
export const EMAIL_CHECK_INTERVAL = 10 * SECOND_IN_MILLISECONDS;
