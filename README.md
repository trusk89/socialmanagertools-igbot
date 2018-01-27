<p align="center"><a href="https://instagram-bot.js.ptkdev.io" alt="Screenshot"><img src="https://ptkdev.it/img/bot/instagram-bot.js.png"></a></p>

<p align="center"><h1 align="center">InstagramBot.js</h1></p>

<p align="center"><a href="#" alt="License"><img src="https://img.shields.io/badge/license-GLPv3-brightgreen.svg"></a>
<a href="https://github.com/GoogleChrome/puppeteer" alt="powered by puppeteer"><img src="https://img.shields.io/badge/powered%20by-puppeteer-46aef7.svg"></a>
<a href="https://github.com/ptkdev/instagram-bot.js/releases" alt="Version"><img src="https://img.shields.io/badge/version-v0.5.1-lightgrey.svg"></a>
<a href="https://slack.ptkdev.io" alt="Slack Chat"><img src="https://img.shields.io/badge/chat%20on-Slack-orange.svg"></a>
<a href="https://paypal.me/ptkdev" alt="Paypale Donate"><img src="https://img.shields.io/badge/donate-PayPal-red.svg"></a>

<p align="center"><a href="https://instagram-bot.js.ptkdev.io" alt="Screenshot"><img src="https://ptkdev.it/img/bot/ptkdev-instagram-bot.gif"></a></p>

# Features
* [✓] Easy to use
* [✓] Login
* [✓] 2FA (bad location)
* [✓] 2FA (sms pin enabled)
* [✓] Multi-Session
* [✓] Multi-Platform
* [✓] Errors manager (bad pin, bad password)
* [✓] Screenshot and Verbose logger
* [✓] Like Mode Classic: bot select random hashtag from config list and like 1 random photo (of last 20), and repeat this all time | 700-850 like/day. Limit is 1000/day for ig. This is safe mode.

# Fast setup
1. Run `npm install` in `instagram-bot.js` folder.
2. Copy root file `config.js.tpl` to `config.js`, fill it properly.
3. Start the bot via `node bot.js`

For advanced configuration see [INSTALL.md](https://github.com/ptkdev/instagram-bot.js/blob/master/INSTALL.md).

#### Pin
If you received sms or email pin edit `loginpin.txt` and insert it on first line. Wait 3 minutes...

#### Check if work:
See images in ./logs/screenshot or disable `chrome_headless` flag.

# Bugs
* Bug: `[ERROR] login: The username you entered doesn't belong to an account. Please check your username and try again. (restart bot and retry...)`
- Solution: Logout from your instagram app, and login again. Reboot bot and retry... Try and retry, and retry, and retry... Or stop bot and wait 2-3h...

# TODO
Features:
* GUI in electron
* likemode_superlike - select random hashtag from config list and like 3 random photo of same user | 700-850 like/day.
* fdfmode_defollowall - defollow all your following (not defollow users in whitelist) | 90 defollow/hour.
* fdfmode_classic - follow user from random hashtag and defollow after 1h | 300 follow-defollow/day.

Nice to have:
* docker container

# Sorry for snake_case
I love snake_case syntax sorry for this :sob: not hate me.

<p align="center"><a href="https://github.com/social-manager-tools" alt="Screenshot"><img src="https://ptkdev.it/img/bot/social-manager-tools.png"></a></p>
<p align="center"><h1 align="center">Social Manager Tools</h1></p>

<p align="center">Available:<br />
<a href="https://github.com/social-manager-tools/instagram-bot.js">InstagramBot.js</a></p>

<p align="center">Coming soon:<br />
<a href="https://github.com/social-manager-tools/twitter-bot.js">TwitterBot.js</a><br />
<a href="https://github.com/social-manager-tools/facebook-page-bot.js">FacebookPageBot.js</a><br />
<a href="https://github.com/social-manager-tools/telegram-wordpress-news-bot.js">TelegramWordpressBot.js</a></p>

<p align="center"><h1 align="center">License</h1></p>

<p align="center">GNU GENERAL PUBLIC LICENSE</p>

<p align="center">Copyright (c) 2018 Patryk Rzucidło (PTKDev)</p>
