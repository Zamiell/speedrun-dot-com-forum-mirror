import type { TextChannel } from "discord.js";
import { ChannelType, Client, GatewayIntentBits } from "discord.js";
import { assertDefined } from "isaacscript-common-ts";
import { env } from "./env.js";
import { logger } from "./logger.js";

let channel: TextChannel | undefined;

export async function discordInit(): Promise<void> {
  const client = new Client({
    // An intent is needed for each type of data that we need Discord to send to us.
    intents: [
      GatewayIntentBits.Guilds, // Needed for `guild.channels.cache` to be populated.
      GatewayIntentBits.GuildMessages, // Needed in order to send messages to a text channel.
    ],
  });

  client.on("ready", (c) => {
    logger.info(`Connected to Discord with a username of: ${c.user.username}`);

    const guild = c.guilds.cache.get(env.DISCORD_GUILD_ID);
    assertDefined(
      guild,
      `Failed to get the Discord guild corresponding to the guild ID: ${env.DISCORD_GUILD_ID}`,
    );

    const outputChannel = guild.channels.cache.get(
      env.DISCORD_OUTPUT_CHANNEL_ID,
    );
    assertDefined(
      outputChannel,
      `Failed to get the Discord channel corresponding to the channel ID: ${env.DISCORD_OUTPUT_CHANNEL_ID}`,
    );

    if (outputChannel.type !== ChannelType.GuildText) {
      throw new TypeError(
        `The Discord channel corresponding to the channel ID of "${env.DISCORD_OUTPUT_CHANNEL_ID}" is not a text channel.`,
      );
    }

    channel = outputChannel;
  });

  logger.info("Logging in to Discord...");
  await client.login(env.DISCORD_TOKEN);
}

export async function discordSend(msg: string): Promise<void> {
  if (channel === undefined) {
    return;
  }

  await channel.send(msg);
}
