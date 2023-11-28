import { authenticate } from "@google-cloud/local-auth";
import type { Credentials, OAuth2Client } from "google-auth-library";
import type { gmail_v1 } from "googleapis";
import { google } from "googleapis";
import {
  fatalError,
  isFile,
  readFile,
  writeFile,
} from "isaacscript-common-node";
import { assertDefined, isObject } from "isaacscript-common-ts";
import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT } from "./constants.js";
import { env } from "./env.js";

const SPEEDRUN_DOT_COM_EMAIL_ADDRESS = "noreply@speedrun.com";

/** If modifying these scopes, delete the token JSON. */
// eslint-disable-next-line isaacscript/require-capital-const-assertions, isaacscript/require-capital-read-only
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

const TOKEN_PATH = path.join(REPO_ROOT, "token.json");
const CREDENTIALS_PATH = path.join(REPO_ROOT, env.GMAIL_OAUTH_FILENAME);

export async function gmailInit(): Promise<void> {
  if (!isFile(CREDENTIALS_PATH)) {
    fatalError(
      `The "${CREDENTIALS_PATH}" file does not exist. Download the OAuth2 JSON file from Google and put it at this path.`,
    );
  }

  const client = await getClient();
  const gmail = google.gmail({ version: "v1", auth: client });
  await listLabels(gmail);
}

async function getClient() {
  const savedCredentials = getSavedCredentials();
  if (savedCredentials !== undefined) {
    return savedCredentials;
  }

  const client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  setSavedCredentials(client.credentials);
  return client;
}

function getSavedCredentials(): OAuth2Client | undefined {
  if (!fs.existsSync(TOKEN_PATH)) {
    return undefined;
  }

  const tokenContent = readFile(TOKEN_PATH);
  const token = JSON.parse(tokenContent) as unknown;
  if (!isObject(token)) {
    throw new Error(
      `Failed to parse the "${TOKEN_PATH}" file since it was not an object.`,
    );
  }

  return google.auth.fromJSON(token) as OAuth2Client;
}

function setSavedCredentials(newCredentials: Credentials) {
  const credentialsContent = readFile(CREDENTIALS_PATH);
  const credentials = JSON.parse(credentialsContent) as unknown;
  if (!isObject(credentials)) {
    throw new Error(
      `Failed to parse the "${CREDENTIALS_PATH}" file since it was not an object.`,
    );
  }

  const key = credentials["installed"] ?? credentials["web"] ?? undefined;
  assertDefined(
    key,
    `The "installed" and "web" keys do not exist in the file: ${CREDENTIALS_PATH}`,
  );

  if (!isObject(key)) {
    throw new Error(
      `Failed to parse the "installed" or "web" key in the "${CREDENTIALS_PATH}" file.`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { client_id, client_secret } = key;

  if (typeof client_id !== "string") {
    throw new TypeError(
      `Failed to parse the "client_id" field in the "${CREDENTIALS_PATH}" file.`,
    );
  }

  if (typeof client_secret !== "string") {
    throw new TypeError(
      `Failed to parse the "client_secret" field in the "${CREDENTIALS_PATH}" file.`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { refresh_token } = newCredentials;

  if (typeof refresh_token !== "string") {
    throw new TypeError(
      `Failed to parse the "refresh_token" field in the "${CREDENTIALS_PATH}" file.`,
    );
  }

  const token = {
    type: "authorized_user",
    client_id,
    client_secret,
    refresh_token: newCredentials.refresh_token,
  } as const;
  const tokenContents = JSON.stringify(token, undefined, 2);
  writeFile(TOKEN_PATH, tokenContents);
}

async function listLabels(gmail: gmail_v1.Gmail) {
  const res = await gmail.users.labels.list({
    userId: "me",
  });
  const { labels } = res.data;
  if (!labels || labels.length === 0) {
    console.log("No labels found.");
    return;
  }
  console.log("Labels:");
  for (const label of labels) {
    console.log(`- ${label.name}`);
  }
}

/*
async function handleNewEmails() {
  try {
    // Get the latest emails
    const listMessagesResponse = await client.users.messages.list({
      userId: "me",
      maxResults: 10,
    });

    // Check if there are any new emails
    if (
      listMessagesResponse.data.messages &&
      listMessagesResponse.data.messages.length > 0
    ) {
      for (const messageId of listMessagesResponse.data.messages) {
        // Get the specific email message
        const message = await client.users.messages.get({
          userId: "me",
          id: messageId,
        });

        // Check if the email is from the target address
        if (
          message.data.payload.headers.find((header) => header.name === "From")
            .value === targetEmailAddress
        ) {
          // Print the debug message
          console.log(
            "Debug message: New email received from",
            targetEmailAddress,
          );
        }
      }
    }
  } catch (error) {
    console.error("Error fetching emails:", error);
  }
}
*/
