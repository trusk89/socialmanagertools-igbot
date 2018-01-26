module.exports = {
    // InstagramBot.js Configs
    "debug": true,

    // BOT Configs
    // [WORK] likemode_classic - select random hashtag from config list and like 1 random photo (of last 20) | 750-900 like/day.
    // [TODO] likemode_superlike - select random hashtag from config list and like 3 random photo of same user | 750-900 like/day.
    // [TODO] fdfmode_classic - follow user from random hashtag and defollow after 1h | 300 follow-defollow/day.
    // [TODO] fdfmode_defollowall - defollow all your following (not defollow users in whitelist) | 90 defollow/hour.
    "bot_mode" : "likemode_classic",
    "bot_likeday_min": 700,
    "bot_likeday_max": 850,

    // Instagram Account
    "instagram_username": "ptkdev", //without @
    "instagram_password": "password",
    "instagram_hashtag": ['muraleshunter','like4like','follow4follow'], //without #
    "instagram_pin": "sms", //method to receive pin (email or sms)
    "instagram_userwhitelist": [''], //without @

    // Puppeteer configs
    "chrome_headless" : false,
    "chrome_options": ['--disable-gpu', '--no-sandbox', '--window-size=1920x1080'],
};
