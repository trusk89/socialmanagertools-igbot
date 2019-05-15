/**
 * API: Write
 * =====================
 * Leave a comment, send message, write reaction, etc...
 *
 * @contributors: Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
 *
 * @license: This code and contributions have 'MIT License'
 *
 */
const Log = require("./../logger/log");
const Translate = require("./../commons/translate");
const Utils = require("./../commons/utils");
const core = require("./../core/core");

class Write {
	constructor(LOG_NAME = "api") {
		this.core = core;
		this.LOG_NAME = LOG_NAME;

		this.log = new Log(this.LOG_NAME);
		this.lang = new Translate();
		this.utils = new Utils();
	}

	/**
     * Comment
     * =====================
     * Write comment on picture page
     *
     * @todo: auto mode for <where> param: detect correct page automatically
     *
     * @param {string} text     - text you want write (mandatory)
     * @param {int}    delay    - speed of write (optional: default 100)
     * @param {string} username - your instagram account (optional: default from config)
     *
     * @return {Object}  response        - {}
     *         {boolean} response.status - true: successful / false: fail
     *         {string}  response.error  - return error detail if status is false
     *
     * @since: v0.10
     *
     */
	async comment(text, delay = 100, username = this.core.config.account.username) {
		let tag = "write::comment()";
		this.log.info(tag, `${this.lang.translate("try_write_comment")}`);

		let response = {"status": false};
		let selector_textarea = "article:nth-child(1) section:nth-child(5) form textarea";
		let selector_username = `article div div a[title="${username}"]`;

		if (typeof this.core.config.selectors[this.utils.clean_tag(tag)] !== "undefined") {
			selector_textarea = this.core.config.selectors[this.utils.clean_tag(tag)];
		}

		try {
			await this.core.bot.waitForSelector(selector_textarea, {timeout: 5000});
			let button = await this.core.bot.$(selector_textarea);
			await button.click();
			await this.core.bot.type(selector_textarea, text, {delay: delay});
			await button.press("Enter");

			await this.core.bot.waitForSelector(selector_username, {timeout: 3000});
			let nickname = await this.core.bot.$(selector_username);

			if (nickname !== null) {
				response.status = true;
			} else {
				response.status = false;
				response.error = "failed";
			}
		} catch (err) {
			response.status = false;
			response.error = err;
		}

		if (response.status) {
			this.log.info(tag, `${this.lang.translate("done")}`);
		} else {
			this.log.error(tag, `${response.error}`);
			this.log.docs("api", tag);
			this.log.stackoverflow(tag, "puppeteer", response.error);
		}

		return response;
	}

	/**
     * Set username (login)
     * =====================
     * Write config username into form login
     *
     * @param {int}    delay    - speed of write (optional: default 100)
     * @param {string} username - your instagram account (optional: default from config)
     *
     * @return {Object}  response        - {}
     *         {boolean} response.status - true: successful / false: fail
     *         {string}  response.error  - return error detail if status is false
     *
     * @since: v0.10
     *
     */
	async login_username(delay = 100, username = this.core.config.account.username) {
		let tag = "write::login_username()";
		this.log.info(tag, `${this.lang.translate("try_set_login_username")}`);

		let response = {"status": false};
		let selector = "input[name=\"username\"]";

		if (typeof this.core.config.selectors[this.utils.clean_tag(tag)] !== "undefined") {
			selector = this.core.config.selectors[this.utils.clean_tag(tag)];
		}

		try {
			await this.core.bot.waitForSelector(selector, {timeout: 5000});
			await this.core.bot.type(selector, username, {delay: delay});

			response.status = true;
		} catch (err) {
			response.status = false;
			response.error = err;
		}

		if (response.status) {
			this.log.info(tag, `${this.lang.translate("done")}`);
		} else {
			this.log.error(tag, `${response.error}`);
			this.log.docs("api", tag);
			this.log.stackoverflow(tag, "puppeteer", response.error);
		}

		return response;
	}

	/**
     * Set password (login)
     * =====================
     * Write config password into form login
     *
     * @param {boolean} delay    - speed of write (optional: default 100)
     * @param {string}  password - your instagram account password (optional: default from config)
     *
     * @return {Object}  response        - {}
     *         {boolean} response.status - true: successful / false: fail
     *         {string}  response.error  - return error detail if status is false
     *
     * @since: v0.10
     *
     */
	async login_password(delay = 100, password = this.core.config.account.password) {
		let tag = "write::login_password()";
		this.log.info(tag, `${this.lang.translate("try_set_login_password")}`);

		let response = {"status": false};
		let selector = "input[name=\"password\"]";

		if (typeof this.core.config.selectors[this.utils.clean_tag(tag)] !== "undefined") {
			selector = this.core.config.selectors[this.utils.clean_tag(tag)];
		}

		try {
			await this.core.bot.waitForSelector(selector, {timeout: 5000});
			await this.core.bot.type(selector, password, {delay: delay});

			response.status = true;
		} catch (err) {
			response.status = false;
			response.error = err;
		}

		if (response.status) {
			this.log.info(tag, `${this.lang.translate("done")}`);
		} else {
			this.log.error(tag, `${response.error}`);
			this.log.docs("api", tag);
			this.log.stackoverflow(tag, "puppeteer", response.error);
		}

		return response;
	}

	/**
     * Set sms pin in 2fa box
     * =====================
     * Write sms pin into input box
     *
     * @param {string} pin   - your sms pin for 2FA (mandatory)
     * @param {int}    delay - speed of write (optional: default 100)
     *
     * @return {Object}  response        - {}
     *         {boolean} response.status - true: successful / false: fail
     *         {string}  response.error  - return error detail if status is false
     *
     * @since: v0.10
     *
     */
	async twofa_pin(pin, delay = 100) {
		let tag = "write::twofa_pin()";
		this.log.info(tag, `${this.lang.translate("try_set_twofa_pin")}`);

		let response = {"status": false};
		let selector = "article form input[name=\"verificationCode\"]";

		if (typeof this.core.config.selectors[this.utils.clean_tag(tag)] !== "undefined") {
			selector = this.core.config.selectors[this.utils.clean_tag(tag)];
		}

		try {
			await this.core.bot.waitForSelector(selector, {timeout: 5000});
			await this.core.bot.type(selector, pin, {delay: delay});

			response.status = true;
		} catch (err) {
			response.status = false;
			response.error = err;
		}

		if (response.status) {
			this.log.info(tag, `${this.lang.translate("done")}`);
		} else {
			this.log.error(tag, `${response.error}`);
			this.log.docs("api", tag);
			this.log.stackoverflow(tag, "puppeteer", response.error);
		}

		return response;
	}

}

module.exports = Write;