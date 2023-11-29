import { EMAIL_CHECK_INTERVAL } from "./constants.js";
import { discordInit } from "./discord.js";
import { checkNewEmails, gmailInit } from "./gmail.js";

await main();

async function main() {
  await discordInit();
  gmailInit();

  await checkNewEmails();
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  setInterval(checkNewEmails, EMAIL_CHECK_INTERVAL);
}
