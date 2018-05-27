/**
 * InstagramBot.js
 * =====================
 * Instagram Bot made with love and nodejs
 *
 * @author:     Patryk Rzucidlo [@ptkdev] <support@ptkdev.io> (https://ptkdev.it)
 * @file:       bot.js
 * @version:    0.7.0
 *
 * @license:    Code and contributions have 'GNU General Public License v3'
 *              This program is free software: you can redistribute it and/or modify
 *              it under the terms of the GNU General Public License as published by
 *              the Free Software Foundation, either version 3 of the License, or
 *              (at your option) any later version.
 *              This program is distributed in the hope that it will be useful,
 *              but WITHOUT ANY WARRANTY; without even the implied warranty of
 *              MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *              GNU General Public License for more details.
 *              You should have received a copy of the GNU General Public License
 *              along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @link        Homepage:     https://instagram.bot.ptkdev.io
 *              GitHub Repo:  https://github.com/social-manager-tools/instagram-bot.js
 */

/**
 * Libs
 * =====================
 * Open source library
 *
 * @link: https://github.com/GoogleChrome/puppeteer
 * 
 */
var bot = null;
const puppeteer = require("puppeteer");
const config = require("./config");
const LOG = require("./modules/logger/types");

async function start(bot, puppeteer, config, LOG) {
    let browser = null;

    /**
     * Init
     * =====================
     * Get username, password and hashtag of bot from /config.js
     * If not exist rename config.js.tmpl to config.js and change strings
     *
     */
    if (config.executable_path === "" || config.executable_path === false) {
        browser = await puppeteer.launch({
            headless: config.chrome_headless,
            args: config.chrome_options
        });
    } else {
        browser = await puppeteer.launch({
            headless: config.chrome_headless,
            args: config.chrome_options,
            executable_path: config.executable_path
        });
    }
    bot = await browser.newPage();

    /**
     * Import libs
     * =====================
     * Modules of bot from folder ./modules
     *
     */
    let routes = require("./routes/strategies");
    let utils = require("./modules/utils")(bot, config);
    let login = require("./modules/login.js")(bot, config, utils);
    let twofa = require("./modules/2FA.js")(bot, config, utils);
    let twofa_pin = require("./modules/Pin2FA.js")(bot, config, utils);

    /**
     * Switch Mode
     * =====================
     * Switch social algorithms, change algorithm from config.js
     *
     */
    async function switch_mode() {
        let strategy = routes[config.bot_mode];
        if (strategy !== undefined) {
            await strategy(bot, config, utils).start();
        } else {
            utils.logger(LOG.ERROR, "switch_mode", `mode ${strategy} not exist!`);
        }
    }

    /**
     * Start Bot (flow) 
     * =====================
     * Login --> 2FA (bad location) --> 2FA (sms pin) --> social algorithm from config.js
     *
     */
    await login.start();

    if (login.is_ok()) {
        await twofa_pin.start_twofa_location_check();

        if (twofa_pin.is_error()) {
            await twofa_pin.start_twofa_check();
        }

        if (twofa_pin.is_ok()) {
            await twofa.start_twofa_location();
        } else if (twofa_pin.is_ok_nextverify()) {
            await twofa.start();
        }

        utils.logger(LOG.INFO, "twofa", "status " + twofa.get_status());

        if (twofa.is_ok() || twofa.is_ok_nextverify()) {
            await switch_mode();
        }

        stop();
    }

}

async function stop() {
    await bot.close();
}

start(bot, puppeteer, config, LOG);