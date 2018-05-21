const LOG_NAME = "twofa";

const Manager_state = require("../modules/base/state").Manager_state;
const STATE = require("../modules/base/state").STATE;
const STATE_EVENTS = require("../modules/base/state").EVENTS;

// log
const Log = require("./logger/Log");

class twofapin extends Manager_state {
    constructor(bot, config, utils) {
        super();
        this.bot = bot;
        this.config = config;
        this.utils = utils;
        this.log = new Log(LOG_NAME);
    }
    /**
     * 2FA Location Flow (check if work)
     * =====================
     *
     */
    async start_twofa_location_check() {
        this.log.info("instagram request pin (bad location)?");

        try {
            let attr = await this.bot.$("#choice_1");

            if (attr !== null)
                this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.OK);
            else
                this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.ERROR);
        } catch (err) {
            this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.ERROR);
        }

        if (this.is_ok()) {
            this.log.info("yes, instagram require security pin... You can not pass!!! (cit.)");
            await this.utils.screenshot(LOG_NAME, "check_pin_request");
        } else {
            this.log.info("no, try second verify");
        }

        this.utils.sleep(this.utils.random_interval(4, 8));

        this.log.info("status: " + this.get_status());
    }

    /**
     * 2FA Flow (check if work)
     * =====================
     *
     */
    async start_twofa_check() {
        this.log.info("instagram request pin (2fa enabled)?");

        try {
            let attr = await this.bot.$("input[name=\"verificationCode\"]");

            if (attr !== null)
                this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.OK_NEXT_VERIFY);
            else
                this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.ERROR);
        } catch (err) {
            this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.ERROR);
        }

        if (this.is_ok_nextverify()) {
            this.log.info("yes, instagram require security pin... You can not pass!1!111! (cit.)");
            await this.utils.screenshot(LOG_NAME, "check_pin_request");

        } else {
            this.log.info("no, bot is at work (started)... Wait...");
            this.log.info("starting current mode");
            await this.utils.screenshot(LOG_NAME, "check_nopin");
        }

        this.utils.sleep(this.utils.random_interval(4, 8));
        this.log.info("status: " + this.get_status());
    }
}

module.exports = (bot, config, utils) => { return new twofapin(bot, config, utils); };