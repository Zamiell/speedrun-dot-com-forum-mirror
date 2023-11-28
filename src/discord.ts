import { Client } from "discord.js";
import { env } from "./env.js";
import { logger } from "./logger.js";

export async function discordInit(): Promise<void> {
  const client = new Client({
    // An intent is needed for each type of data that we need Discord to send to us.
    intents: [],
    /// intents: [GatewayIntentBits.Guilds],
  });

  client.on("ready", (c) => {
    logger.info(`Connected to Discord with a username of: ${c.user.username}`);

    const guild = c.guilds.cache.get(env.DISCORD_GUILD_ID);
    console.log("LOL:", guild);
  });

  logger.info("Logging in to Discord...");
  console.log("LOL:", env.DISCORD_TOKEN);
  await client.login(env.DISCORD_TOKEN);
}

export function discordSend(): void {
  /// const channel = await channel.send(msg);
}
