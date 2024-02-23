// Based on: https://developers.google.com/gmail/api/quickstart/nodejs

import { authenticate } from "@google-cloud/local-auth";
import type { Auth } from "googleapis";
import {
  dirName,
  fatalError,
  isFile,
  readFile,
  writeFile,
} from "isaacscript-common-node";
import type { ReadonlyRecord } from "isaacscript-common-ts";
import { assertDefined, isObject } from "isaacscript-common-ts";
import path from "node:path";

const __dirname = dirName();

const REPO_ROOT = path.join(__dirname, "..");
const TOKEN_PATH = path.join(REPO_ROOT, "token.json");
const CREDENTIALS_PATH = path.join(REPO_ROOT, "credentials.json");
const DEFAULT_REDIRECT_URI = "http://localhost:3000/oauth2callback";

// eslint-disable-next-line isaacscript/require-capital-const-assertions, isaacscript/require-capital-read-only
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

await main();

async function main() {
  const credentials = getCredentials();
  const client = await getClient();

  setSavedCredentials(credentials, client);
  console.log(`Successfully created file: ${TOKEN_PATH}`);
}

function getCredentials(): Record<string, unknown> {
  if (!isFile(CREDENTIALS_PATH)) {
    fatalError(
      `The "${CREDENTIALS_PATH}" file does not exist. Follow the steps in the README to create it and put it at this path.`,
    );
  }

  const credentialsContent = readFile(CREDENTIALS_PATH);
  const credentials = JSON.parse(credentialsContent) as unknown;
  if (!isObject(credentials)) {
    fatalError(
      `Failed to parse the "${CREDENTIALS_PATH}" file since it was not an object.`,
    );
  }

  const { web } = credentials;
  if (!isObject(web)) {
    fatalError(
      `Failed to parse the "${CREDENTIALS_PATH}" file since the "web" sub-object was missing.`,
    );
  }

  // When downloading the JSON file from the Google Cloud console, it does not automatically come
  // with a redirect URI in it, which is necessary for the next step. We need to write it back to
  // the file so that the `authenticate` function reads it.
  if (web["redirect_uris"] === undefined) {
    web["redirect_uris"] = [DEFAULT_REDIRECT_URI]; // It has to be in an array.
    const newCredentialsContent = JSON.stringify(credentials, undefined, 2);
    writeFile(CREDENTIALS_PATH, newCredentialsContent);
  }

  return credentials;
}

async function getClient(): Promise<Auth.OAuth2Client> {
  const client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH, // cspell:ignore keyfile
  });

  return client;
}

function setSavedCredentials(
  credentials: ReadonlyRecord<string, unknown>,
  client: Auth.OAuth2Client,
) {
  const key = credentials["installed"] ?? credentials["web"] ?? undefined;
  assertDefined(
    key,
    `The "installed" and "web" keys do not exist in the file: ${CREDENTIALS_PATH}`,
  );

  if (!isObject(key)) {
    fatalError(
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
  const { refresh_token } = client.credentials;

  if (typeof refresh_token !== "string") {
    throw new TypeError(
      'Failed to parse the "refresh_token" field in the authenticated client.',
    );
  }

  const token = {
    type: "authorized_user",
    client_id,
    client_secret,
    refresh_token,
  } as const;
  const tokenContents = JSON.stringify(token, undefined, 2);
  writeFile(TOKEN_PATH, tokenContents);
}
