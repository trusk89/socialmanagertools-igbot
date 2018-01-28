# v0.5.2 (January 28, 2018)
* Fix [[#3](https://github.com/ptkdev/instagram-bot.js/issues/3)]: Like doesn't work if the language is not in English


# v0.5.1 (January 27, 2018)
* Fix: package.json syntax error


# v0.5.0 (January 26, 2018)
* New logo! Thanks to @maXfer75 and @TaniK72 on twitter.
* Bye bye webdriverio and selenium: moved to official google library "puppeteer". Better ram usage, better stability and no java required. Dropped firefox, ie and opera support (only chrome). Added multiplatform support (mac, windows, linux). INFO: The webdriverio old version of bot (0.4.2) is available on branch "webdriverio".


# v0.4.2 (January 25, 2018)

* Refactor: moved to selenium npm package


# v0.4.1 (January 23, 2018)

* Feature: like/day in config (max and min)
* Feature: method pin
* Refactor: removed self (useless)
* Fix: missing apos in config


# v0.4.0 (January 21, 2018)

* Refactor: async wait v2
* Refactor: bot.js without function flow
* Fix: clear array if # not have photos
* Fix: java heap size error (now is max 2gb)
* Fix: errors 2FA location 


# v0.3.1 (January 18, 2018)

* Fix: 110% cpu usage
* Fix: flow without pin


# v0.3.0 (January 18, 2018)

* Refactor: moved to async wait
* Refactor: add pm2 and forever to npm run
* Update: chromedriver binary
* Fix: get url picture selector
* Fix: <3 selector
* Fix: screen server resolution
* Fix: 2FA-security location
* Fix: 2FA-security enabled


# v0.2.1 (January 15, 2018)

* Ops: bad run script in package.json


# v0.2.0 (January 15, 2018)

* New flow pattern
* Refactor: removed eval()
* Refactor: removed setTimeout() and added system-sleep (run: npm install)
* Refactor: folder routes moved to modules 
* Feature: switch_mode()
* Fix: 2FA bugs
* Fix: errors manager bugs
* Fix: screenshot bugs
* Fix: random dislike


# v0.1.1 (January 13, 2018)

* Fix debug (verbose)
* Updated README.md


# v0.1.0 (January 12, 2018)

* First Release.
* Login
* 2FA
* Multi-Session
* Errors manager (bad pin, bad password)
* Screenshot and Verbose logger
* Like Mode Classic: bot select random hashtag from config list and like 1 random photo (of last 20), and repeat this all time | 750-900 like/day. Limit is 1000/day for ig. This is safe mode.
