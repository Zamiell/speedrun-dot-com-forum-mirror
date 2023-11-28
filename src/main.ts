import { discordInit } from "./discord.js";
import { gmailInit } from "./gmail.js";

await main();

async function main() {
  await discordInit();
  gmailInit();
}
