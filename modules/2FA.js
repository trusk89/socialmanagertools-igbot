/**
 * Two Factor Authentication (2FA) Flow
 * =====================
 * Bot flow of instagram pin request at login
 *
 * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
 * @license:    This code and contributions have 'GNU General Public License v3'
 * @version:    0.2
 * @changelog:  0.1 initial release
 *              0.2 new pattern
 *
 */
class Twofa {
    constructor(bot, config, utils) {
        this.bot = bot;
        this.config = config;
        this.utils = utils;
    }

    /**
     * Login PIN: tweet
     * =====================
     * Press submit button
     *
     * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
     * @license:    This code and contributions have 'GNU General Public License v3'
     * @version:    0.1
     * @changelog:  0.1 initial release
     *
     */
    async requestpin() {
        this.utils.logger("[WARNING]", "twofa", "please insert pin in loginpin.txt and wait 2-3 minutes... (tic... tac... tic... tac... tic...)");
        await this.bot.click('form button');
    }

    /**
     * Login PIN: Choice Email
     * =====================
     * Press on email choice
     *
     * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
     * @license:    This code and contributions have 'GNU General Public License v3'
     * @version:    0.1
     * @changelog:  0.1 initial release
     *
     */
    async choice_email() {
        this.utils.logger("[INFO]", "twofa", "try switch to phone email");
        await this.bot.click('section form label[for="choice_1"]');
    }

    /**
     * Login PIN: Choice SMS
     * =====================
     * Press on email sms
     *
     * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
     * @license:    This code and contributions have 'GNU General Public License v3'
     * @version:    0.1
     * @changelog:  0.1 initial release
     *
     */
    async choice_sms() {
        this.utils.logger("[INFO]", "twofa", "try switch to phone sms (if possible)");
        await this.bot.click('section form label[for="choice_0"]');
    }

    /**
     * Login PIN: Switch for SMS or Email pin
     * =====================
     * Set default pin receiver method
     *
     * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
     * @license:    This code and contributions have 'GNU General Public License v3'
     * @version:    0.1
     * @changelog:  0.1 initial release
     *
     */
    async sendpin() {
        this.choice_sms();
        this.utils.sleep(this.utils.random_interval(4, 8));
        this.requestpin();
        this.utils.sleep(this.utils.random_interval(4, 8));
    }

    /**
     * Login PIN: Read pint
     * =====================
     * Open loginpin.txt and insert in security-code input
     *
     * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
     * @license:    This code and contributions have 'GNU General Public License v3'
     * @version:    0.1
     * @changelog:  0.1 initial release
     *
     */
    async readpin(input) {
        this.utils.logger("[INFO]", "twofa", "readpin");
        const fs = require('fs');
        let self = this;
        let data = fs.readFileSync(__dirname + "/../loginpin.txt", "utf8");
        let pin = data.toString();
        await self.bot.setValue('input[name="' + input + '"]', pin);
        await self.utils.screenshot("twofa", "readpin");
        this.utils.sleep(this.utils.random_interval(4, 8));
    }

    /**
     * Login PIN: Final submit
     * =====================
     * Open loginpin.txt and insert in security-code input
     *
     * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
     * @license:    This code and contributions have 'GNU General Public License v3'
     * @version:    0.1
     * @changelog:  0.1 initial release
     *
     */
    async submit() {
        this.utils.logger("[INFO]", "twofa", "submit");
        await this.bot.click('form button');
    }

    /**
     * Login PIN: check errors
     * =====================
     * Check if submit not have errors
     *
     * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
     * @license:    This code and contributions have 'GNU General Public License v3'
     * @version:    0.1
     * @changelog:  0.1 initial release
     *
     */
    async submitverify(input) {
        let self = this;
        let status = "";
        let attr = "";
        try {
            attr = await this.bot.getAttribute('input[name="' + input + '"]', 'value');
            self.utils.logger("[ERROR]", "twofa", "twofa: OMG! You are slow... Restart bot and retry... Idiot...");
            await self.utils.screenshot("twofa", "submitverify_error");
            status = -1;
        } catch (err) {
            self.utils.logger("[INFO]", "twofa", "pin is ok");
            await self.utils.screenshot("twofa", "submitverify_ok");
            status = 1;
        }
        this.utils.sleep(this.utils.random_interval(4, 8));
        if (status == 1) {
            try {
                attr = await this.bot.getAttribute('input[name="username"]', 'value');
                self.utils.logger("[ERROR]", "twofa", "instagram error... auto logout... restart bot...");
                await self.utils.screenshot("twofa", "submitverify_error2");
                status = -1;
            } catch (err) {
                self.utils.logger("[INFO]", "twofa", "instagram no have a crash");
                await self.utils.screenshot("twofa", "submitverify_ok2");
                status = 1;
            }
        }
        this.utils.sleep(this.utils.random_interval(4, 8));
        return status;
    }


    /**
     * 2FA Location Flow (check if work)
     * =====================
     * /modules/2FA.js
     * 
     * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
     * @license:    This code and contributions have 'GNU General Public License v3'
     * @version:    0.1
     * @changelog:  0.1 initial release
     *
     */
    async start_twofa_location_check(pin_status) {
        this.utils.logger("[INFO]", "twofa", "instagram request pin (bad location)?");
        try {
            let attr = await this.bot.getAttribute('#choice_1', 'value');
            if (this.config.debug == true)
                this.utils.logger("[DEBUG]", "twofa", "attr = " + attr);
            this.utils.logger("[INFO]", "twofa", "yes, instagram require security pin... You can not pass!1!111! (cit.)");
            await this.utils.screenshot("twofa", "check_pin_request");
            pin_status = 1;
        } catch (err) {
            if (this.config.debug == true)
                this.utils.logger("[DEBUG]", "twofa", err);
            this.utils.logger("[INFO]", "twofa", "no, try second verify");
            pin_status = 0;
        }

        return pin_status;
    }

    /**
     * 2FA Flow (check if work)
     * =====================
     * /modules/2FA.js
     * 
     * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
     * @license:    This code and contributions have 'GNU General Public License v3'
     * @version:    0.1
     * @changelog:  0.1 initial release
     *
     */
    async start_twofa_check(pin_status) {
        this.utils.logger("[INFO]", "twofa", "instagram request pin (2fa enabled)?");
        let self = this;
        try {
            let attr = await this.bot.getAttribute('input[name="verificationCode"]', 'value');
            if (this.config.debug == true)
                this.utils.logger("[DEBUG]", "twofa", "attr = " + attr);
            this.utils.logger("[INFO]", "twofa", "yes, instagram require security pin... You can not pass!1!111! (cit.)");
            await this.utils.screenshot("twofa", "check_pin_request");
            pin_status = 2;
        } catch (err) {
            if (this.config.debug == true)
                this.utils.logger("[DEBUG]", "twofa", err);
            this.utils.logger("[INFO]", "twofa", "no, bot is at work (started)... Wait...");
            this.utils.logger("[INFO]", "twofa", "starting current mode");
            await this.utils.screenshot("twofa", "check_nopin");
            this.utils.sleep(this.utils.random_interval(4, 8));
            pin_status = 0;
        }

        return pin_status;
    }

    /**
     * 2FA (Bad location) Flow
     * =====================
     * /modules/2FA.js
     * 
     * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
     * @license:    This code and contributions have 'GNU General Public License v3'
     * @version:    0.1
     * @changelog:  0.1 initial release
     *
     */
    async start_twofa_location(twofa_status) {
        this.utils.logger("[INFO]", "twofa (location)", "loading...");
        await this.sendpin();
        this.utils.sleep(this.utils.random_interval(120, 180));
        await this.readpin("security_code");
        this.utils.sleep(this.utils.random_interval(4, 8));
        await this.submit();
        this.utils.sleep(this.utils.random_interval(4, 8));
        twofa_status = await this.submitverify("security_code");
        this.utils.sleep(this.utils.random_interval(4, 8));
        return twofa_status;
    }

    /**
     * 2FA (Enabled) Flow
     * =====================
     * /modules/2FA.js
     * 
     * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
     * @license:    This code and contributions have 'GNU General Public License v3'
     * @version:    0.1
     * @changelog:  0.1 initial release
     *
     */
    async start(twofa_status) {
        this.utils.logger("[INFO]", "twofa (enabled)", "loading...");
        this.utils.logger("[WARNING]", "twofa", "please insert pin in loginpin.txt and wait 2-3 minutes... (tic... tac... tic... tac... tic...)");
        this.utils.sleep(this.utils.random_interval(120, 180));
        await this.readpin("verificationCode");
        this.utils.sleep(this.utils.random_interval(4, 8));
        await this.submit();
        this.utils.sleep(this.utils.random_interval(4, 8));
        twofa_status = await this.submitverify("verificationCode");
        this.utils.sleep(this.utils.random_interval(4, 8));

        return twofa_status;
    }

}


module.exports = (bot, config, utils) => { return new Twofa(bot, config, utils); };