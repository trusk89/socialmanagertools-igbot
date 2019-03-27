[![Social Manager Tools: IG BOT](.github/assets/smt_igbot_logo.png)](https://socialmanager.tools)

# 🤖 Social Manager Tools: Instagram Bot API

[![](https://img.shields.io/badge/version-v0.9.11-lightgrey.svg)](https://github.com/social-manager-tools/socialmanagertools-igbot/releases) [![](https://img.shields.io/npm/v/socialmanagertools-igbot.svg)](https://www.npmjs.com/package/socialmanagertools-igbot) [![](https://img.shields.io/badge/license-MIT-brightgreen.svg)](#) [![](https://img.shields.io/badge/ES-9-F7DF1E.svg)](https://wikipedia.org/wiki/ECMAScript) [![](https://img.shields.io/badge/powered%20by-puppeteer-46aef7.svg)](https://github.com/GoogleChrome/puppeteer) [![](https://snyk.io/test/npm/@social-manager-tools/igbot/badge.svg)](https://snyk.io/test/github/social-manager-tools/socialmanagertools-igbot)

> This library (include bot and api) helps you increase the engagement level of your Instagram profile through different social algorithms and provides api for include custom bot functions in your application. Increase the likes on your photos and followers!

> ⛔ **DISCLAIMER**: This is **unofficial** library without warranty! Assumes no responsibility in the event of account ban or any problem with your profile. Using bot on instagram does not respect the terms of service: use this software at your own risk. A "bot" is legal software but using a bot continuously violates the regulation of your instagram account and you risks: __soft ban__ (like and follow restrictions daily) or __ban__ with suspension for a few days (or for life). All trademarks and logos belong to their respective owners.

## 🎁 Support: Donate
> This project is **free**, **open source** and I try to provide excellent support. Why donate? I work on this project 10 hours a week and in my spare time, I try to keep it up-to-date and working. I'm not going to charge the basic features but this can not be done without financial support. There are professional bots __closed source__ on the Internet and save your password on the cloud at a cost of 14€ per month and I not want you pay monthly the same amount but with a much smaller donation I can guarantee you systematic and continuous updates as well as offering all the assistance I can via email and in the "github issues". **THANK YOU!**

[![](https://img.shields.io/badge/donate-paypal-005EA6.svg)](http://paypal.ptkdev.io) [![](https://img.shields.io/badge/donate-patreon-F87668.svg)](http://patreon.ptkdev.io) [![](https://img.shields.io/badge/donate-opencollective-5DA4F9.svg)](http://opencollective.ptkdev.io) [![](https://img.shields.io/badge/buy%20me-coffee-4B788C.svg)](http://coffee.ptkdev.io)

## 🔖 Screenshot
[![](.github/assets/screenshot/smt_igbot_screenshot.gif)](https://socialmanager.tools)

## 📎 Menu
- 💾 Installation:
  - 🔨 [Fast install](http://docs.socialmanager.tools/igbot/installation/cli/README.md) (CLI / NPM Package)
  - 👨‍💻 [Desktop App](http://docs.socialmanager.tools/gui/installation/README.md) (Windows, Linux, Mac)
  - 🦀 [Raspberry PI](http://docs.socialmanager.tools/igbot/installation/raspberry/README.md) (Raspbian 9)
  - 🐳 [Docker](http://docs.socialmanager.tools/igbot/installation/docker/README.md)
- 📚 [API Documentation](http://docs.socialmanager.tools/igbot/api/README.md) (How create your personal bot or mode)
- 💻 [Developers Guidelines](http://docs.socialmanager.tools/developers/guidesline/README.md) (If you want contributing)
- 🐛 [Bugs](https://github.com/social-manager-tools/socialmanagertools-igbot/issues?q=is%3Aopen+is%3Aissue+label%3Abug)

## 💡 Features
* [✔️] Easy to use
* [✔️] Login
* [✔️] 2FA (bad location)
* [✔️] 2FA (sms pin enabled)
* [✔️] Multi-Session
* [✔️] Multi-Platform (Windows 10, Mac OSX, Linux and Raspberry PI)
* [✔️] Error management feature (bad pin, bad password)
* [✔️] Screenshot and Verbose logger
* [✔️] Like Mode Classic: bot selects a random hashtag from a config list and likes 1 random photo, and can repeat this all time.
* [✔️] Like Mode Realistic: bot selects a random hashtag from a config list and likes fast 10-12 photos, it sleeps 15-20min and repeats this all time. Sleeps at night.
* [✔️] Like Mode Competitor Users: it selects an account, selects random followers, likes 10-12 photo and sleeps 15-20min. Sleeps at night.
* [✔️] Like Mode Super like: it selects random hashtag from a config list and likes 3 random photos of the same user.
* [✔️] Comment Mode Classic: it selects random comments and random hashtags and writes comments under photos.
* [✔️] Follow/Defollow Classic: follow 30 users, defollow first and rotate (in loop). This method is not detect from socialblade. 300 follow-defollow/day.

## 👨‍💻 Desktop setup (GUI)
1. Download [Social Manager Tools](https://github.com/social-manager-tools/social-manager-tools/releases) GUI.
2. Run application.
3. If it works add a star 🌟 at this project ❤️
4. If you want to help me: **donate on [paypal](http://paypal.ptkdev.io)/[ko-fi](http://coffee.ptkdev.io)** or become a **[backer on patreon](http://patreon.ptkdev.io)**.

## 🔨 Fast usage (CLI)
1. Download [stable](https://github.com/social-manager-tools/socialmanagertools-igbot/archive/master.zip), [beta](https://github.com/social-manager-tools/socialmanagertools-igbot/archive/beta.zip) or [nightly](https://github.com/social-manager-tools/socialmanagertools-igbot/archive/nightly.zip) and extract it.
2. Download [Node.js](https://nodejs.org/it/) (LTS release) and install it.
3. Run `npm install` in `socialmanagertools-igbot` folder.
4. Remove `.tpl` suffix from `config.js.tpl` file in `configs` folder and fill it properly.
5. Start the bot via `npm run start`
6. If it works add a star 🌟 at this project ❤️
7. If you want to help me: **donate on [paypal](http://paypal.ptkdev.io)/[ko-fi](http://coffee.ptkdev.io)** or become a **[backer on patreon](http://patreon.ptkdev.io)**.

## 🔧 Fast usage (NPM Module)
1. Run `npm install @social-manager-tools/igbot@latest --save` (Available: @latest, @beta and @nightly)
2. Get `config.js` file from `/node_modules/@social-manager-tools/igbot/configs/` folder.
3. Remove `.tpl` suffix from `config.js.tpl` file in `configs` folder and fill it properly.
4. On your code require library, config and run bot, example:
```javascript
const config = require ("./config");
const Bot = require("@social-manager-tools/igbot");
let bot = new Bot(config);

(async () => {
	await bot.start();

	let api = await bot.api();

	let response = await api.login.flow();

	if (response.status) {
		response = await api.twofa.flow();
	}

	if (response.status) {
		response = await api.mode.flow();
	}

	await bot.stop();
})();
```
5. If it works add a star 🌟 at this project ❤️
6. If you want to help me: **donate on [paypal](http://paypal.ptkdev.io)/[ko-fi](http://coffee.ptkdev.io)** or become a **[backer on patreon](http://patreon.ptkdev.io)**.

## 🐳 Docker setup
If you prefer to run this using Docker, an official container is available from the [Docker Hub](https://hub.docker.com/u/socialmanagertools).

In order to run it, copy the `config.js.tpl` file (template of available in `configs` folder), configure it as you prefer, then use it through volume mapping,
like in this example:

```sh
docker run --restart=always --name=smt-igbot-api -d -v /path/to/configs/config.js:/app/configs/config.js social-manager-tools/socialmanagertools-igbot:amd64
```

**AVAILABLE TAGS:** `amd64` (64bit), `i386` (32bit),`armv7` (Raspberry PI 2), `armv8` (Raspberry PI 3). All point to the master github repository (stable version).

**WARNING:** with docker is mandatory edit `config.js` and set `chrome_headless` on `true` and set `chrome_executable_path` to `/usr/bin/chromium-browser`. Without this manual fix docker don't work.

## 📚 Documentation
1. Run `npm run docs-init`
2. Run `npm run docs`

If you want are available online [here](http://docs.socialmanager.tools/README.md).

### 🐍 Sorry for snake_case
I love snake_case syntax sorry for this 😭 don't hate me.

### 🍻 Community
[![](https://img.shields.io/badge/chat%20on-discord-7289da.svg)](http://discord.ptkdev.io) [![](https://img.shields.io/badge/chat%20on-slack-orange.svg)](http://slack.ptkdev.io)  [![](https://img.shields.io/badge/blog-medium-2AE176.svg)](http://blog.ptkdev.io) [![](https://img.shields.io/badge/twitter-socialmanagertools-2AA3EF.svg)](https://twitter.com/socialmanagertools)

### ❤️ Contributing
I 💟 contributions! I will happily accept your pull request! Translations, grammatical corrections (GrammarNazi you are welcome! Yes my English is bad, sorry), new modes, best css selectors, fix and new feature! Read [Developers Guidelines](http://docs.socialmanager.tools/developers/guidesline/README.md) for best practices. Do not be afraid, if the code is not perfect we will work together 👯 and remember to insert your name in `.all-contributorsrc` and `package.json` file.

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="https://ptk.dev"><img src="https://avatars1.githubusercontent.com/u/442844?v=4" width="100px;" alt="Patryk Rzucidło"/><br /><sub><b>Patryk Rzucidło</b></sub></a><br /><a href="https://github.com/ptkdev/socialmanagertools-igbot/commits?author=ptkdev" title="Code">💻</a></td><td align="center"><a href="https://twitter.com/maxfer75"><img src="https://pbs.twimg.com/profile_images/1102339688797483008/bFxTzuF2_400x400.jpg" width="100px;" alt="MaXfer "/><br /><sub><b>MaXfer </b></sub></a><br /><a href="#design-maxfer75" title="Design">🎨</a></td><td align="center"><a href="https://twitter.com/tanik72"><img src="https://pbs.twimg.com/profile_images/1082017438017949696/_p2tIzrW_400x400.jpg" width="100px;" alt="Tanik"/><br /><sub><b>Tanik</b></sub></a><br /><a href="#design-TaniK72" title="Design">🎨</a></td><td align="center"><a href="https://github.com/agoalofalife"><img src="https://avatars1.githubusercontent.com/u/15719824?v=4" width="100px;" alt="Ilua Chubarov"/><br /><sub><b>Ilua Chubarov</b></sub></a><br /><a href="https://github.com/ptkdev/socialmanagertools-igbot/commits?author=agoalofalife" title="Code">💻</a></td><td align="center"><a href="https://julianxhokaxhiu.com"><img src="https://avatars1.githubusercontent.com/u/1237070?v=4" width="100px;" alt="Julian Xhokaxhiu"/><br /><sub><b>Julian Xhokaxhiu</b></sub></a><br /><a href="https://github.com/ptkdev/socialmanagertools-igbot/commits?author=julianxhokaxhiu" title="Code">💻</a></td><td align="center"><a href="https://lecouey.me"><img src="https://avatars1.githubusercontent.com/u/8327054?v=4" width="100px;" alt="Léonard Lecouey"/><br /><sub><b>Léonard Lecouey</b></sub></a><br /><a href="https://github.com/ptkdev/socialmanagertools-igbot/commits?author=lecoueyl" title="Code">💻</a></td></tr><tr><td align="center"><a href="https://github.com/lollymouth"><img src="https://avatars1.githubusercontent.com/u/43947950?v=4" width="100px;" alt="Lollymouth"/><br /><sub><b>Lollymouth</b></sub></a><br /><a href="https://github.com/ptkdev/socialmanagertools-igbot/commits?author=lollymouth" title="Code">💻</a></td><td align="center"><a href="https://github.com/roNn23"><img src="https://avatars1.githubusercontent.com/u/849194?v=4" width="100px;" alt="roNn23"/><br /><sub><b>roNn23</b></sub></a><br /><a href="https://github.com/ptkdev/socialmanagertools-igbot/commits?author=roNn23" title="Code">💻</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

> 💰 In the future, if the donations allow it, I would like to share some of the success with those who helped me the most. For me open source is share of code, share development knowledges and share donations!

### 👑 Sponsor
You want your logo here? See sponsor tier on [on patreon](http://patreon.ptkdev.io) (max 10 sponsors available)

### 📲 Tools
[![](https://img.shields.io/badge/app-social%20manager%20tools-ff7f19.svg)](http://socialmanager.tools/)
[![](https://img.shields.io/badge/api-instagram%20bot-895a4d.svg)](https://github.com/social-manager-tools/socialmanagertools-igbot)
[![](https://img.shields.io/badge/api-twitter%20bot-21B7F4.svg)](https://github.com/social-manager-tools/socialmanagertools-twbot)
[![](https://img.shields.io/badge/api-facebook%20bot-3b5998.svg)](https://github.com/social-manager-tools/socialmanagertools-fbbot)
[![](https://img.shields.io/badge/telegram%20bot-feed%20rss%20for%20wordpress%20&amp;%20medium-00AB6C.svg)](https://github.com/social-manager-tools/social-manager-tools-tgbot)

[![](https://img.shields.io/badge/app-meingifs-E1215B.svg)](https://meingifs.pics/)
[![](https://img.shields.io/badge/stickers-ptkdev-128C7E.svg)](https://stickers.ptkdev.io/)

### 💫 License
* Code and Contributions have **MIT License**
* Images and logos have **CC BY-NC 4.0 License**
* Documentations and Translations have **CC BY 4.0 License**

###### Copyleft (c) 2018-2019 [Patryk Rzucidło](https://ptk.dev) ([@PTKDev](https://twitter.com/ptkdev)) <[support@ptkdev.io](mailto:support@ptkdev.io)>