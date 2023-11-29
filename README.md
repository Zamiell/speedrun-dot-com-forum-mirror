# speedrun-forum-to-discord

`speedrun-forum-to-discord` is a bot that posts a notification in a [Discord](https://discord.com/) channel whenever there is a post made inside of a game's forum on [speedrun.com](speedrun.com).

The bot is written in [TypeScript](https://www.typescriptlang.org/) using the [Discord.js](https://discord.js.org/) library for Node.js.

## Pre-Installation

- Download and install [Git](https://git-scm.com/), if you do not have it already.
- Download and install [Node.js](https://nodejs.org/en/), if you do not have it already.
- Set up a new [Gmail](https://gmail.com/) account.
- Set up a new [Speedrun.com](https://speedrun.com/) account using the new Gmail account.
- Follow the game(s) that you want notifications for (by clicking on the heart button).
- Go to your [notification settings](https://www.speedrun.com/users/Zamiel/settings/notifications) and turn on email notifications for:
  - "Forum thread created in game you follow"
  - "Forum post created in game you follow"
- Ensure that all other email notifications are turned off.
- Follow the steps in the [Node.js quick-start Gmail API documentation](https://developers.google.com/gmail/api/quickstart/nodejs) until you have a "credentials.json" file. Stop at the "Install the client library" part, since the client library is already contained in this repository.

## Installation

- Clone the repository:
  - `cd [the path where you want the code to live]` (optional)
  - If you already have an SSH key pair and have the public key attached to your GitHub profile, then use the following command to clone the repository via SSH:
    - `git clone git@github.com:Zamiell/racing-plus.git`
  - If you do not already have an SSH key pair, then use the following command to clone the repository via HTTPS:
    - `git clone https://github.com/Zamiell/racing-plus.git`
- Enter the cloned repository:
  - `cd speedrun-forum-to-discord`
- Install Yarn, if you have not done so already:
  - `corepack enable`
- Install dependencies:
  - `yarn install`
- Put the "credentials.json" from the pre-installation step in the root of the repository directory.
- Run the script to generate a "token.json" file that contains your Gmail token:
  - `npm run generate-gmail-token` (this will cause a new tab to open in your web browser so that you can complete authentication)
- Delete the "credentials.json" file, since it is no longer necessary.
- Copy ".env.example" to ".env" and fill in the values.
- Run the server to test to see if it works:
  - `npm run start`

## Install as a Service

- Install [PM2](https://pm2.io/docs/runtime/guide/installation/):
  - `npm install pm2 -g`
- Make PM2 run at startup:
  - `pm2 startup`
- Compile the TypeScript code:
  - `npm run build`
- Add a new PM2 service (assuming you have the repository at "/root/speedrun-forum-to-discord"):
  - `pm2 start "/root/speedrun-forum-to-discord/dist/main.js" --name "speedrun-forum-to-discord" --merge-logs --log="/root/speedrun-forum-to-discord/logs/speedrun-forum-to-discord.log"`
- Save the PM2 service:
  `pm2 save`
