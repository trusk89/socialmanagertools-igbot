/**
 * Login Flow
 * =====================
 * Write / and see commands of bot
 *
 * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
 * @license:    This code and contributions have 'GNU General Public License v3'
 * @version:    0.2
 * @changelog:  0.1 initial release
 *              0.2 new pattern
 *
 */
class Login {
    constructor(bot, config, utils) {
        this.bot = bot;
        this.config = config;
        this.utils = utils;
    }
    
    /**
     * Open login page
     * =====================
     * Browser start
     *
     * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
     * @license:    This code and contributions have 'GNU General Public License v3'
     * @version:    0.1
     * @changelog:  0.1 initial release
     *
     */
    async open_loginpage() {
        this.utils.logger("[INFO]", "login", "open_loginpage");
        await this.bot.url('https://www.instagram.com/accounts/login/');
    }

    /**
     * Compile input
     * =====================
     * Set username
     *
     * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
     * @license:    This code and contributions have 'GNU General Public License v3'
     * @version:    0.1
     * @changelog:  0.1 initial release
     *
     */
    async set_username() {
        await this.bot.setValue('input[name="username"]', this.config.instagram_username);
        this.utils.logger("[INFO]", "login", "set_username");
    }

    /**
     * Compile input
     * =====================
     * Set password
     *
     * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
     * @license:    This code and contributions have 'GNU General Public License v3'
     * @version:    0.1
     * @changelog:  0.1 initial release
     *
     */
    async set_password() {
        await this.bot.setValue('input[name="password"]', this.config.instagram_password);
        this.utils.logger("[INFO]", "login", "set_password");
    }

    /**
     * Login
     * =====================
     * Press submit button
     *
     * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
     * @license:    This code and contributions have 'GNU General Public License v3'
     * @version:    0.1
     * @changelog:  0.1 initial release
     *
     */
    async submit() {
        this.utils.logger("[INFO]", "login", "submit");
        await this.utils.screenshot("login", "submit");
        await this.bot.click('form button');
    }

    /**
     * Login check errors
     * =====================
     * Bad password or similar
     *
     * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
     * @license:    This code and contributions have 'GNU General Public License v3'
     * @version:    0.1
     * @changelog:  0.1 initial release
     *
     */
    async submitverify() {
        this.utils.logger("[INFO]", "login", "checkerrors");
        let status = null;
        try {
            let text = await this.bot.getText('#slfErrorAlert');
            status = 0;
            this.utils.logger("[ERROR]", "login", text + " (restart bot and retry...)");
            await this.utils.screenshot("login", "checkerrors_error");
        } catch (err) {
            status = 1;
            this.utils.logger("[INFO]", "login", "password is correct");
            await this.utils.screenshot("login", "checkerrors");
        }
        this.utils.sleep(this.utils.random_interval(4, 8));
        return status;
    }

    /**
     * Login Flow
     * =====================
     * /modules/likemode_login.js
     * 
     * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
     * @license:    This code and contributions have 'GNU General Public License v3'
     * @version:    0.1
     * @changelog:  0.1 initial release
     *
     */
    async start(login_status) {
        this.utils.logger("[INFO]", "login", "loading...");
        await this.open_loginpage();
        this.utils.sleep(this.utils.random_interval(4, 8));
        await this.set_username();
        this.utils.sleep(this.utils.random_interval(4, 8));
        await this.set_password();
        this.utils.sleep(this.utils.random_interval(4, 8));
        await this.submit();
        this.utils.sleep(this.utils.random_interval(4, 8));
        login_status = await this.submitverify();
        this.utils.logger("[INFO]", "login", "login_status is " + login_status);
        this.utils.sleep(this.utils.random_interval(4, 8));
        return login_status;
    }
}

module.exports = (bot, config, utils) => { return new Login(bot, config, utils); };