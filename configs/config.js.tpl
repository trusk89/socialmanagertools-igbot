module.exports = {
	// Developer Configs
	"system": {
		"config_version": "1.0.0",   // version of this file, version increase if change values from previously config
		"language": "en",            // available: en = English / it = Italian
		"raspberry": "disabled",     // if you use raspbian this fix automatically common issues
		"ui": "disabled",            // enabled/disabled only if you work at social-manager-tools GUI
		"terminal_colors": "enabled" // enabled/disabled if you want colors in windows power shell/cmd, mac console or linux terminal
	},

	// Instagram Account
	"account": {
		"username": "ptkdev",   // instagram nickname
		"password": "password", // instagram password
		"pin_method": "auto"    // 2FA: method for receive pin (auto: first authenticator if is enabled and after sms)
	},

	// Set Bot Mode, available:
	// likemode_classic            - select random hashtag from config list and like 1 random photo (of last 20)
	// likemode_realistic          - select random hashtag from config list, like fast 10-12 photo and sleep 15-20min
	// likemode_realistic_location - select random gps-location from config list, like fast 10-12 photo and sleep 15-20min
	// likemode_realistic_timeline - like fast 10-12 photo from your timeline and sleep 15-20min
	// likemode_superlike          - select random hashtag from config list and like 3 random photo of same user
	// likemode_superlike_location - select random gps-location from config list and like 3 random photo of same user
	// likemode_competitor_users   - select account, select random followers, like 10-12 photo and sleep 15-20min
	// commentmode_classic         - leave a comment under the photo via hashtag
	// commentmode_location        - leave a comment under the photo via gps-location
	// fdfmode_classic             - follow 30 users, and defollow the first followed at 31 follow, follow 1 (in loop)
	// fdfmode_classic_location    - select random gps-location, follow 30 users, and defollow the first followed at 31 follow, follow 1 (in loop)
	//
	// Modes details: http://docs.socialmanager.tools/igbot/installation/modes
	// Multi account: http://docs.socialmanager.tools/igbot/installation/multiaccount
	"bot_mode": "likemode_realistic", // this is NOT array. 1 mode is allowed

	// Edit options of current bot_mode you use.
	"bot_mode_options": {
		"likemode_realistic": {
			"instagram_hashtag": ["rome", "italy", "muraleshunter"], // recommended more than 20
			"likeday_min": "800",      // min like daily.
			"likeday_max": "900",      // max like daily. In 2018 limit instagram is 1000/day
			"sleep_night": "disabled", // if you need stop bot in night
			"sleep_end": "7:00",        // sleep from 00:00 to 7:00 am
			"database": {
				"default": "./databases/likemode_realistic.json" // json databases with modes info for better report
			},
		},
		"likemode_realistic_location": {
			"instagram_location": ["213050058", "31499759", "675369430"], // recommended more than 20
			"likeday_min": "800",      // min like daily.
			"likeday_max": "900",      // max like daily. In 2018 limit instagram is 1000/day
			"sleep_night": "disabled", // if you need stop bot in night
			"sleep_end": "7:00",        // sleep from 00:00 to 7:00 am
			"database": {
				"default": "./databases/likemode_realistic_location.json" // json databases with modes info for better report
			},
		},
		"likemode_realistic_myfeed": {
			"likeday_min": "800",      // min like daily.
			"likeday_max": "900",      // max like daily. In 2018 limit instagram is 1000/day
			"sleep_night": "disabled", // if you need stop bot in night
			"sleep_end": "7:00",        // sleep from 00:00 to 7:00 am
			"database": {
				"default": "./databases/likemode_realistic_myfeed.json" // json databases with modes info for better report
			},
		},
		"likemode_classic": {
			"instagram_hashtag": ["rome", "italy", "muraleshunter"], // recommended more than 20
			"likeday_min": "800",      // min like daily.
			"likeday_max": "900",      // max like daily. In 2018 limit instagram is 1000/day
			"sleep_night": "disabled", // if you need stop bot in night
			"sleep_end": "7:00",        // sleep from 00:00 to 7:00 am
			"database": {
				"default": "./databases/likemode_classic.json" // json databases with modes info for better report
			},
		},
		"likemode_classic_location": {
			"instagram_location": ["213050058", "31499759", "675369430"], // recommended more than 20
			"likeday_min": "800",      // min like daily.
			"likeday_max": "900",      // max like daily. In 2018 limit instagram is 1000/day
			"sleep_night": "disabled", // if you need stop bot in night
			"sleep_end": "7:00",        // sleep from 00:00 to 7:00 am
			"database": {
				"default": "./databases/likemode_classic_location.json" // json databases with modes info for better report
			},
		},
		"likemode_superlike": {
			"instagram_hashtag": ["rome", "italy", "muraleshunter"], // recommended more than 20
			"superlike_n": "3",        // number of likes for user (max 12)
			"likeday_min": "800",      // min like daily.
			"likeday_max": "900",      // max like daily. In 2018 limit instagram is 1000/day
			"sleep_night": "disabled", // if you need stop bot in night
			"sleep_end": "7:00",        // sleep from 00:00 to 7:00 am
			"database": {
				"default": "./databases/likemode_superlike.json" // json databases with modes info for better report
			},
		},
		"likemode_superlike_location": {
			"instagram_location": ["213050058", "31499759", "675369430"], // recommended more than 20
			"superlike_n": "3",        // number of likes for user (max 12)
			"likeday_min": "800",      // min like daily.
			"likeday_max": "900",      // max like daily. In 2018 limit instagram is 1000/day
			"sleep_night": "disabled", // if you need stop bot in night
			"sleep_end": "7:00",        // sleep from 00:00 to 7:00 am
			"database": {
				"default": "./databases/likemode_superlike_location.json" // json databases with modes info for better report
			},
		},
		"commentmode_realistic": {
			"instagram_hashtag": ["rome", "italy", "muraleshunter"], // recommended more than 20
			"comments_list": ["⭐⭐⭐", "🔥", "Nice pic!"], // recommended more than 10 (emoij supported)
			"comments_min": "300",      // min comments daily.
			"comments_max": "400",      // max comments daily. In 2018 limit instagram is 500/day
			"sleep_night": "disabled",  // if you need stop bot in night
			"sleep_end": "7:00",        // sleep from 00:00 to 7:00 am
			"database": {
				"default": "./databases/commentmode_realistic.json" // json databases with modes info for better report
			},
		},
		"commentmode_realistic_location": {
			"instagram_location": ["213050058", "31499759", "675369430"], // recommended more than 20
			"comments_list": ["comment1", "comment2", "comment3"], // recommended more than 10
			"comments_min": "300",      // min comments daily.
			"comments_max": "400",      // max comments daily. In 2018 limit instagram is 500/day
			"sleep_night": "disabled",  // if you need stop bot in night
			"sleep_end": "7:00",        // sleep from 00:00 to 7:00 am
			"database": {
				"default": "./databases/commentmode_realistic_location.json" // json databases with modes info for better report
			},
		},
		"fdfmode_realistic": {
			"instagram_hashtag": ["rome", "italy", "muraleshunter"], // recommended more than 20
			"followday": "300",   // number of follow-defollow user/day, work in fdfmode_classic. In 2018 limit instagram is 500/day
			"followrotate": "30", // follow 30 users, and defollow the first followed at 31 follow (in loop). If is 0 defollow all followed users previously by bot
			"userwhitelist": ["user1", "user2", "user3"], // don't defollow this users
			"sleep_night": "disabled",  // if you need stop bot in night
			"sleep_end": "7:00",        // sleep from 00:00 to 7:00 am
			"database": {
				"default": "./databases/fdfmode_classic.json" // json databases with modes info for better report
			},
		},
		"fdfmode_realistic_location": {
			"instagram_location": ["213050058", "31499759", "675369430"], // recommended more than 20
			"followday": "300",   // number of follow-defollow user/day, work in fdfmode_classic. In 2018 limit instagram is 500/day
			"followrotate": "30", // follow 30 users, and defollow the first followed at 31 follow (in loop). If is 0 defollow all followed users previously by bot
			"userwhitelist": ["user1", "user2", "user3"], // don't defollow this users
			"sleep_night": "disabled",  // if you need stop bot in night
			"sleep_end": "7:00",        // sleep from 00:00 to 7:00 am
			"database": {
				"default": "./databases/fdfmode_classic.json" // json databases with modes info for better report
			},
		},
		"likemode_competitor_users": {
			"account": "user_nickname", // instagram nickname
			"likeday_min": "800",      // min like daily.
			"likeday_max": "900",      // max like daily. In 2018 limit instagram is 1000/day
			"sleep_night": "disabled",  // if you need stop bot in night
			"sleep_end": "7:00",        // sleep from 00:00 to 7:00 am
			"database": {
				"default": "./databases/likemode_competitor_users.json" // json databases with modes info for better report
			},
		},
	},

	// Force overwrite css selectors if not work, example: {"click_heart":"button#heart"}
	// Syntax is apiName_functionName, example: write::comment() => {"write_comment":"article > textarea.comment"}
	"selectors": {},

	// Puppeteer Configs
	"puppeteer": {
		"chrome_headless": "enabled", // hide google chrome window
		"chrome_options": ["--disable-gpu", "--no-sandbox", "--window-size=1024x768"], // google chrome args
		"chrome_useragent": "", // overwrite chrome user agent
		"chrome_executable_path": "" /* If you want run installed chrome browser, not from npm module
									  *  example for Mac OS: /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome
									  *  example for Linux:  /usr/bin/chromium
									  */
	},

	// Proxy
	"proxy": {
		"server": "",
		"port": "",
	},

	// LOGS
	"log": {
		"path": {
			"pin": "./configs/loginpin.txt",
			"debug_log": "./logs/debug.log",
			"error_log": "./logs/errors.log",
			"screenshots": "./logs/screenshots/",
		},
		"screenshot": "disabled",  // enabled/disabled screenshot in logs/screenshots folder
		"debug": "enabled",        // enabled/disabled all logs with tag debug
		"info": "enabled",         // enabled/disabled all logs with tag info
		"warning": "enabled",      // enabled/disabled all logs with tag warning
		"errors": "enabled",       // enabled/disabled all logs with tag errors
	}
};