import { getEnv } from "isaacscript-common-node";
import { z } from "zod";

const envSchema = z.object({
  DISCORD_TOKEN: z.string().min(1),
  DISCORD_GUILD_ID: z.string().min(1),
  DISCORD_OUTPUT_CHANNEL_ID: z.string().min(1),
});

export const env = getEnv(envSchema);
