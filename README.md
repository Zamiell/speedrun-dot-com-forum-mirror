# speedrun-forum-to-discord

`speedrun-forum-to-discord` is a bot that posts a notification in a [Discord](https://discord.com/) channel whenever there is a post made inside of a game's forum on [speedrun.com](speedrun.com). It does this by utilizing the email notifications + the Gmail API.

Since most video-game speedrunning communities have their own Discord servers, this functionality is useful to allow a game's community to easily follow new posts without having to have their own personal email accounts be spammed.

The bot is written in [TypeScript](https://www.typescriptlang.org/) using the [Discord.js](https://discord.js.org/) library for Node.js and the [Google APIs client](https://github.com/googleapis/google-api-nodejs-client) for Node.js.

## Methodology

This section discusses how and why the bot was created.

The usual way to construct a bot that gets new forum posts would be to use the corresponding forum API. However, Speedrun.com does not have a forum API, and there are also no plans to add one. (The API has not been updated since the website was acquired by [Elo Entertainment](https://www.elo.io/) on Oct 13, 2020, and there are even open pull requests dating back to 2018.) Thus, we have to resort to more inconvenient methods.

In order to check for new posts, the next most straightforward method would be to perform [web-scraping](https://en.wikipedia.org/wiki/Web_scraping) on the forum URLs. However, for some reason, new forum posts do not appear for non-logged-in users until 30 minutes have passed. This makes the bot run on a 30 minute delay, which is not ideal. In order to work around that, we could log in as a fake user and then provide the bot with the corresponding web cookie. But then we would have to worry about cookie expiration, which is not ideal. And furthermore, a web-scraping bot on an N second timer is not very friendly to Speedrun.com itself.

Luckily, there is a better solution. Speedrun.com offers an email notification feature where you can be emailed on certain events occurring, including any forum post on a game that you "follow". Thus, instead of a bot checking Speedrun.com directly, we can set up a bot to check an email address for new emails, and then echo the contents of those email messages into a Discord channel.

This bot arbitrarily choses Gmail as the email provider, since they have an excellent API. However, in theory you could use any email provider you like for this purpose.

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
  - `pm2 save`
