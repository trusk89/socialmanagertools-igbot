<p align="center"><a href="https://instagrambotjs.ptkdev.io" alt="Screenshot"><img src="https://ptkdev.it/img/bot/instagram-bot.js.png"></a></p>

<p align="center"><h1 align="center">InstagramBot.js</h1></p>

<p align="center"><a href="#" alt="License"><img src="https://img.shields.io/badge/license-GLPv3-brightgreen.svg"></a>
<a href="https://github.com/GoogleChrome/puppeteer" alt="powered by puppeteer"><img src="https://img.shields.io/badge/powered%20by-puppeteer-46aef7.svg"></a>
<a href="https://github.com/social-manager-tools/instagram-bot.js/releases" alt="Version"><img src="https://img.shields.io/badge/version-v0.6.2-lightgrey.svg"></a>
<a href="https://slack.ptkdev.io" alt="Slack Chat"><img src="https://img.shields.io/badge/chat%20on-Slack-orange.svg"></a>
<a href="https://paypal.me/ptkdev" alt="Paypale Donate"><img src="https://img.shields.io/badge/donate-PayPal-red.svg"></a>
<a href="mailto:support@ptkdev.io" alt="Support: support@ptkdev.io"><img src="https://img.shields.io/badge/help-support@ptkdev.io-fbbc05.svg"></a></p>

<p align="center"><a href="https://instagrambotjs.ptkdev.io" alt="Screenshot"><img src="https://ptkdev.it/img/bot/ptkdev-instagram-bot.gif"></a></p>

# What does he do
This bot helps you increase the engagement of your Instagram profile through different social algorithms. Increase the likes on your photos and followers.

# Features
* [✓] Easy to use
* [✓] Login
* [✓] 2FA (bad location)
* [✓] 2FA (sms pin enabled)
* [✓] Multi-Session
* [✓] Multi-Platform (Windows 10, Mac OSX, Linux, [Raspberry PI 3](https://github.com/social-manager-tools/instagram-bot.js/blob/master/INSTALL.md))
* [✓] Errors manager (bad pin, bad password)
* [✓] Screenshot and Verbose logger
* [✓] Like Mode Classic: bot select random hashtag from config list and like 1 random photo and repeat this all time.
* [✓] Like Mode Realistic: bot select random hashtag from config list and like fast 10-12 photos, sleep 15-20min and repeat this all time. Sleep at night.

# Fast setup
1. Download [stable bot version](https://github.com/ptkdev/instagram-bot.js/releases) and extract it.
2. Download [Node.js](https://nodejs.org/it/) >= 7.6 and install it.
3. Run `npm install` in `instagram-bot.js` folder.
4. Copy root file `config.js.tpl` to `config.js`, fill it properly.
5. Start the bot via `node bot.js`
6. If work add star :star: at this project :heart:
7. If you want help me with <b><a href="https://paypal.me/ptkdev">little donation</a></b> as you like for development of new features and fix.

For advanced configuration see [INSTALL.md](https://github.com/social-manager-tools/instagram-bot.js/blob/master/INSTALL.md).

#### 2FA: SMS Pin
If you received sms or email pin edit `loginpin.txt` and insert it on first line. Wait 3 minutes...

#### Tips: hide browser
Edit `config.js` and switch `chrome_headless` option to `true`.

#### Check if work:
See images in ./logs/screenshot or disable `chrome_headless` flag.

# Bugs
* `[ERROR] login: The username you entered doesn't belong to an account. Please check your username and try again. (restart bot and retry...)`
* Why happen? Instagram desktop is in overcapacity. Happen at 12-14 and 19-21 all days. 
* Solution: Login in other time or Logout from your instagram app, and login again. Reboot bot and retry... Try and retry, and retry, and retry... Or stop bot and wait 2-3h...

# Docker

If you prefer to run this using Docker, an official container is available from the [Docker Hub](https://hub.docker.com/u/ptkdev/).

In order to run it, copy the `config.js.tpl` file, configure it as you prefer, then use it through volume mapping,
like in this example:

```sh
$ docker run \
    --restart=always \
    --name=instagram-bot \
    -d \
    -v /path/to/config.js:/app/config.js \
    social-manager-tools/instagram-bot &>/dev/null
```

# TODO
Features:
* GUI in electron
* likemode_superlike - select random hashtag from config list and like 3 random photo of same user | 400-600 like/day.
* fdfmode_defollowall - defollow all your following (not defollow users in whitelist) | 90 defollow/hour.
* fdfmode_classic - follow user from random hashtag and defollow after 1h | 300 follow-defollow/day.

# Sorry for snake_case
I love snake_case syntax sorry for this :sob: don't hate me.

<p align="center"><a href="https://github.com/social-manager-tools" alt="Screenshot"><img src="https://ptkdev.it/img/bot/social-manager-tools.png"></a></p>
<p align="center"><h1 align="center">Social Manager Tools</h1></p>

<p align="center">Available:<br />
<a href="https://github.com/social-manager-tools/instagram-bot.js">InstagramBot.js</a> (<a href="https://github.com/social-manager-tools/instagram-bot-gui.js">GUI</a>)<br />
<a href="https://github.com/social-manager-tools/wordpress-telegram-bot.js">TelegramWordpressBot.js</a></p>

<p align="center">Coming soon:<br />
<a href="https://github.com/social-manager-tools/twitter-bot.js">TwitterBot.js</a><br />
<a href="https://github.com/social-manager-tools/facebookpage-bot.js">FacebookPageBot.js</a><br />

<p align="center"><h1 align="center">License</h1></p>

<p align="center">GNU GENERAL PUBLIC LICENSE</p>

<p align="center">Copyright (c) 2018 Patryk Rzucidło (PTKDev)</p>
