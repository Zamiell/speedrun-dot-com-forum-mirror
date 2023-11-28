import { createEnv } from "@t3-oss/env-core";
import dotenv from "dotenv";
import { fatalError } from "isaacscript-common-node";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { REPO_ROOT } from "./constants.js";

const ENV_PATH = path.join(REPO_ROOT, ".env");

if (!fs.existsSync(ENV_PATH)) {
  fatalError(
    `The "${ENV_PATH}" file does not exist. Copy ".env.example" to ".env" and re-run this program.`,
  );
}

dotenv.config({
  path: ENV_PATH,
});

export const env = createEnv({
  server: {
    DISCORD_TOKEN: z.string(),
    DISCORD_GUILD_ID: z.string(),
    DISCORD_OUTPUT_CHANNEL_ID: z.string(),
  },

  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
