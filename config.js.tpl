module.exports = {
    // InstagramBot.js Configs
    "debug": true,
    "login":true,
    // Instagram Account
    "instagram_username": "ptkdev", // without @
    "instagram_password": "password",
    "instagram_hashtag": ['muraleshunter','like4like','follow4follow'], //without #
    "instagram_pin": "sms", //method to receive pin (email or sms)

    // BOT Configs
    // [WORK] likemode_classic    - select random hashtag from config list and like 1 random photo (of last 20) | 400-600 like/day.
    // [WORK] likemode_realistic  - select random hashtag from config list, like fast 10-12 photo and sleep 15-20min. Sleep at night
    // [WORK] likemode_competitor_users - select account, select random followers, like 10-12 photo and sleep 15-20min.
    // [TEST] likemode_superlike  - select random hashtag from config list and like 3 random photo of same user | 400-600 like/day.
    // [TEST] fdfmode_classic     - follow user from random hashtag and defollow after 1h | 300 follow-defollow/day.
    // [TEST] comment_mode        - leave a comment under the photo via hashtag.
    // [TODO] fdfmode_defollowall - defollow all your following (not defollow users in whitelist) | 30 defollow/hour.
    "bot_mode" : "likemode_classic",
    "bot_likeday_min": 400,
    "bot_likeday_max": 600,     // in 2018 limit instagram is descreased to 400-600/day :(
    "bot_sleep_night": "7:00",  // sleep from 00:00 to 7:00 am, work only in likemode_realistic and comment_mode
    "bot_fastlike_min": "15",   // min minutes of sleep after like 10-12 photo, work only in likemode_realistic
    "bot_fastlike_max": "20",   // max minutes of sleep after like 10-12 photo, work only in likemode_realistic
    "bot_followday": 300,       // follow-defollow user/day, work only in fdfmode_classic
    "bot_userwhitelist": [''],  // usernames without @ | don't defollow this users on follow-defollow mode, work only in all fdfmode_*
    "comment_mode":{
        "comments":{
           "type":"array",
           "source":[],
          }
    },
    "likemode_competitor_users:{
        'account':'', // without @
    },
    // Puppeteer configs
    "chrome_headless" : false,
    "chrome_options": ['--disable-gpu', '--no-sandbox', '--window-size=1920x1080'],
    "executablePath": "" // example for Mac OS: /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome

};
