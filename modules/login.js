const LOG = require('../modules/logger/types');
const LOG_NAME = 'login';

const Manager_state = require('./base/state').Manager_state;
const STATE = require('./base/state').STATE;
const STATE_EVENTS = require('./base/state').EVENTS;

/**
 * Login Flow
 * =====================
 * Open browser, set user/pass and try login
 *
 * @author:     Patryk Rzucidlo [@ptkdev] <support@ptkdev.io> (https://ptkdev.it)
 * @license:    This code and contributions have 'GNU General Public License v3'
 * @version:    0.5
 * @changelog:  0.1 initial release
 *              0.2 new pattern with webdriverio
 *              0.5 new pattern with puppeteer
 *
 */
class Login extends Manager_state{
    constructor(bot, config, utils) {
        super();
        this.bot = bot;
        this.config = config;
        this.utils = utils;
    }

    /**
     * Open login page
     * =====================
     * Browser start
     *
     */
    async open_loginpage() {
        this.utils.logger(LOG.INFO, LOG_NAME, "open_loginpage");

        await this.bot.goto('https://www.instagram.com/accounts/login/');
    }

    /**
     * Compile input
     * =====================
     * Set username
     *
     */
    async set_username() {
        this.utils.logger(LOG.INFO, LOG_NAME, "set_username");

        await this.bot.waitForSelector('input[name="username"]');
        await this.bot.type('input[name="username"]', this.config.instagram_username, { delay: 100 });
    }

    /**
     * Compile input
     * =====================
     * Set password
     *
     */
    async set_password() {
        this.utils.logger(LOG.INFO, LOG_NAME, "set_password");

        await this.bot.waitForSelector('input[name="password"]');
        await this.bot.type('input[name="password"]', this.config.instagram_password, { delay: 100 });
    }

    /**
     * Login
     * =====================
     * Press submit button
     *
     */
    async submitform() {
        this.utils.logger(LOG.INFO, LOG_NAME, "submit");

        await this.bot.waitForSelector('form button');
        let button = await this.bot.$('form button');
        await button.click();

        await this.utils.screenshot(LOG_NAME, "submit");
    }

    /**
     * Login check errors
     * =====================
     * Bad password or similar
     *
     */
    async submitverify() {
        this.utils.logger(LOG.INFO, LOG_NAME, "checkerrors");

        let text = "";

        try {
            text = await this.bot.$('#slfErrorAlert');
            if (text !== null)
                this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.ERROR);
            else
                this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.OK);
        } catch (err) {
            this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.OK);
        }

        if (this.isError()) {
            let html_response = await this.bot.evaluate(body => body.innerHTML, text);
            await text.dispose();

            this.utils.logger(LOG.ERROR, LOG_NAME, "Error: " + html_response + " (restart bot and retry...)");
            await this.utils.screenshot(LOG_NAME, "checkerrors_error");
        } else {
            this.utils.logger(LOG.INFO, LOG_NAME, "password is correct");
            await this.utils.screenshot(LOG_NAME, "checkerrors");
        }

        this.utils.sleep(this.utils.random_interval(4, 8));
    }

    /**
     * Login Flow
     * =====================
     *
     */
    async start() {
        this.utils.logger(LOG.INFO, LOG_NAME, "loading...");

        await this.open_loginpage();

        this.utils.sleep(this.utils.random_interval(4, 8));

        await this.set_username();

        this.utils.sleep(this.utils.random_interval(4, 8));

        await this.set_password();

        this.utils.sleep(this.utils.random_interval(4, 8));

        await this.submitform();

        this.utils.sleep(this.utils.random_interval(4, 8));

        await this.submitverify();
        this.utils.logger(LOG.INFO, LOG_NAME, "login_status is " + this.getStatus());

        this.utils.sleep(this.utils.random_interval(4, 8));
    }
}

module.exports = (bot, config, utils) => { return new Login(bot, config, utils); };