const LOG = require('../modules/logger/types');
const LOG_NAME = 'twofa';

/**
 * Two Factor Authentication (2FA) Flow
 * =====================
 * Flow for pin request after login
 *
 * @author:     Patryk Rzucidlo [@ptkdev] <support@ptkdev.io> (https://ptkdev.it)
 * @license:    This code and contributions have 'GNU General Public License v3'
 * @version:    0.5
 * @changelog:  0.1 initial release
 *              0.2 new pattern with webdriverio
 *              0.5 new pattern with puppeteer
 *
 */
class Twofa {
    constructor(bot, config, utils) {
        this.bot = bot;
        this.config = config;
        this.utils = utils;
        this.status = {
            OK: 1,
            OK_NEXT_VERIFY: 2,
            ERROR: 0,
            STOP_BOT: -1,
            CURRENT: null,
        };
    }

    /**
     * Login PIN: request pin
     * =====================
     * Press submit button
     *
     */
    async requestpin() {
        this.utils.logger(LOG.WARNING, LOG_NAME, "please insert pin in loginpin.txt and wait 2-3 minutes... (tic... tac... tic... tac... tic...)");

        let button = await this.bot.$('form button');
        await button.click();
    }

    /**
     * Login PIN: Choice Email
     * =====================
     * Press on email choice
     *
     */
    async choice_email() {
        this.utils.logger(LOG.INFO, LOG_NAME, "try switch to phone email");

        let radio = await this.bot.$('section form label[for="choice_1"]');
        await radio.click();
    }

    /**
     * Login PIN: Choice SMS
     * =====================
     * Press on email sms
     *
     */
    async choice_sms() {
        this.utils.logger(LOG.INFO, LOG_NAME, "try switch to phone sms (if possible)");

        let radio = await this.bot.$('section form label[for="choice_0"]');
        await radio.click();
    }

    /**
     * Login PIN: Switch for SMS or Email pin
     * =====================
     * Set default pin receiver method
     *
     */
    async sendpin() {
        if (this.config.instagram_pin === "sms")
            await this.choice_sms();

        this.utils.sleep(this.utils.random_interval(4, 8));

        await this.requestpin();

        this.utils.sleep(this.utils.random_interval(4, 8));
    }

    /**
     * Login PIN: Read pint
     * =====================
     * Open loginpin.txt and insert in security-code input
     *
     */
    async readpin(input) {
        this.utils.logger(LOG.INFO, LOG_NAME, "readpin");

        const fs = require('fs');
        let data = fs.readFileSync(__dirname + "/../loginpin.txt", "utf8");
        let pin = data.toString();

        await this.bot.waitForSelector('input[name="' + input + '"]');
        await this.bot.type('input[name="' + input + '"]', pin, { delay: 100 });
        await this.utils.screenshot(LOG_NAME, "readpin");

        this.utils.sleep(this.utils.random_interval(4, 8));
    }

    /**
     * Login PIN: Final submit
     * =====================
     * Open loginpin.txt and insert in security-code input
     *
     */
    async submitform() {
        this.utils.logger(LOG.INFO, LOG_NAME, "submit");
        try {
            await this.bot.waitForSelector('form button');
            let button = await this.bot.$('form button');
            await button.click();
        } catch (err) {
            if (this.config.debug == true)
                this.utils.logger(LOG.DEBUG, LOG_NAME, err);
        }
    }

    /**
     * Login PIN: check errors
     * =====================
     * Check if submit not have errors
     *
     */
    async submitverify(selector) {
        let status = "";
        let attr = "";

        try {
            attr = await this.bot.$('input[name="' + selector + '"]');
            if (attr != null)
                this.status.CURRENT = this.status.STOP_BOT;
            else
                this.status.CURRENT = this.status.OK;
        } catch (err) {
            this.status.CURRENT = this.status.OK;
        }

        if (this.status.CURRENT === this.status.STOP_BOT) {
            this.utils.logger(LOG.ERROR, LOG_NAME, "twofa: OMG! You are slow... Restart bot and retry... Idiot...");
            await this.utils.screenshot(LOG_NAME, "submitverify_error");
        } else if (this.status.CURRENT === this.status.OK) {
            this.utils.logger(LOG.INFO, LOG_NAME, "pin is ok");
            await this.utils.screenshot(LOG_NAME, "submitverify_ok");
        }

        this.utils.sleep(this.utils.random_interval(4, 8));

        if (this.status.CURRENT === this.status.OK) {
            try {
                attr = await this.bot.$('input[name="username"]');
                if (attr != null)
                    this.status.CURRENT = this.status.STOP_BOT;
                else
                    this.status.CURRENT = this.status.OK;
            } catch (err) {
                this.status.CURRENT = this.status.STOP_BOT;
            }

            if (this.status.CURRENT === this.status.STOP_BOT) {
                this.utils.logger(LOG.ERROR, LOG_NAME, "instagram error... auto logout... restart bot...");
                await this.utils.screenshot(LOG_NAME, "submitverify_error2");
            } else if (this.status.CURRENT === this.status.OK) {
                this.utils.logger(LOG.ERROR, LOG_NAME, "instagram no have a crash");
                await this.utils.screenshot(LOG_NAME, "submitverify_ok2");
            }
        }

        this.utils.sleep(this.utils.random_interval(4, 8));

        return this.status.CURRENT;
    }

    /**
     * 2FA Location Flow (check if work)
     * =====================
     *
     */
    async start_twofa_location_check() {
        this.utils.logger(LOG.INFO, LOG_NAME, "instagram request pin (bad location)?");

        try {
            let attr = await this.bot.$('#choice_1');

            if (attr !== null)
                this.status.CURRENT = this.status.OK;
            else
                this.status.CURRENT = this.status.ERROR;
        } catch (err) {
            this.status.CURRENT = this.status.ERROR;
        }

        if (this.status.CURRENT === this.status.OK) {
            this.utils.logger(LOG.INFO, LOG_NAME, "yes, instagram require security pin... You can not pass!1!111! (cit.)");
            await this.utils.screenshot(LOG_NAME, "check_pin_request");
        } else {
            this.utils.logger(LOG.INFO, LOG_NAME, "no, try second verify");
        }

        this.utils.sleep(this.utils.random_interval(4, 8));

        this.utils.logger(LOG.INFO, LOG_NAME, "status: " + this.status.CURRENT);

        return this.status.CURRENT;
    }

    /**
     * 2FA Flow (check if work)
     * =====================
     *
     */
    async start_twofa_check() {
        this.utils.logger(LOG.INFO, LOG_NAME, "instagram request pin (2fa enabled)?");

        try {
            let attr = await this.bot.$('input[name="verificationCode"]');

            if (attr !== null)
                this.status.CURRENT = this.status.OK_NEXT_VERIFY;
            else
                this.status.CURRENT = this.status.ERROR;
        } catch (err) {
            this.status.CURRENT = this.status.ERROR;
        }

        if (this.status.CURRENT === this.status.OK_NEXT_VERIFY) {
            this.utils.logger(LOG.INFO, LOG_NAME, "yes, instagram require security pin... You can not pass!1!111! (cit.)");
            await this.utils.screenshot(LOG_NAME, "check_pin_request");

        } else {
            this.utils.logger(LOG.INFO, LOG_NAME, "no, bot is at work (started)... Wait...");
            this.utils.logger(LOG.INFO, LOG_NAME, "starting current mode");
            await this.utils.screenshot(LOG_NAME, "check_nopin");
        }

        this.utils.sleep(this.utils.random_interval(4, 8));

        this.utils.logger(LOG.INFO, LOG_NAME, "status: " + this.status.CURRENT);

        return this.status.CURRENT;
    }

    /**
     * 2FA (Bad location) Flow
     * =====================
     *
     */
    async start_twofa_location() {
        this.utils.logger(LOG.INFO, "twofa (location)", "loading...");

        await this.sendpin();

        this.utils.sleep(this.utils.random_interval(120, 180));

        await this.readpin("security_code");

        this.utils.sleep(this.utils.random_interval(4, 8));

        await this.submitform();

        this.utils.sleep(this.utils.random_interval(4, 8));

        let status = await this.submitverify("security_code");

        this.utils.sleep(this.utils.random_interval(4, 8));

        return status;
    }

    /**
     * 2FA (Enabled) Flow
     * =====================
     *
     */
    async start() {
        this.utils.logger(LOG.INFO, "twofa (enabled)", "loading...");

        this.utils.logger(LOG.WARNING, LOG_NAME, "please insert pin in loginpin.txt and wait 2-3 minutes... (tic... tac... tic... tac... tic...)");
        this.utils.sleep(this.utils.random_interval(120, 180));
        await this.readpin("verificationCode");
        this.utils.sleep(this.utils.random_interval(4, 8));
        await this.submitform();
        this.utils.sleep(this.utils.random_interval(4, 8));
        let status = await this.submitverify("verificationCode");
        this.utils.sleep(this.utils.random_interval(4, 8));

        return status;
    }

}


module.exports = (bot, config, utils) => { return new Twofa(bot, config, utils); };