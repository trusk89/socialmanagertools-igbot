/**
 * API: Check
 * =====================
 * is_logged, is_liked, etc...
 *
 * @contributors: Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
 *
 * @license: This code and contributions have 'MIT License'
 *
 *
 */
const Log = require("./../logger/log");
const Translate = require("./../commons/translate");
const Utils = require("./../commons/utils");
const core = require("./../core/core");

class Check {
	constructor(LOG_NAME = "api") {
		this.core = core;
		this.LOG_NAME = LOG_NAME;
		this.log = new Log(this.LOG_NAME);
		this.lang = new Translate();
		this.utils = new Utils();
	}

	/**
     * Check login status (logged or error at login)
     * =====================
     * Get error popup text if exist
     *
     * @return {Object}  response        - {}
     *         {boolean} response.status - true: successful / false: fail
     *         {string}  response.error  - return error detail if status is false
     *
     * @since: v0.10
     *
     */
	async login_status() {
		let tag = "check::login_status()";
		this.log.info(tag, `${this.lang.translate("try_check_login_status")}`);

		let response = {"status": false};
		let selector = "#slfErrorAlert";
		let text = null;
		let html_response = "";

		if (typeof this.core.config.selectors[this.utils.clean_tag(tag)] !== "undefined") {
			selector = this.core.config.selectors[this.utils.clean_tag(tag)];
		}

		try {
			text = await this.core.bot.$(selector);
			if (text !== null) {
				html_response = await this.core.bot.evaluate(body => body.innerHTML, text);
				await text.dispose();

				this.log.error(tag, `${html_response}`);
				response.status = false;
				response.error = html_response;
			} else {
				response.status = true;
			}
		} catch (err) { // if html element #slfErrorAlert not exist, login is ok
			response.status = true;
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
     * Check login crash status (auto logout)
     * =====================
     * Get error if login crash
     *
     * @return {Object}  response        - {}
     *         {boolean} response.status - true: successful / false: fail
     *         {string}  response.error  - return error detail if status is false
     *
     * @since: v0.10
     *
     */
	async login_crash_status() {
		let tag = "check::login_crash_status()";
		this.log.info(tag, `${this.lang.translate("try_check_crash_login_status")}`);

		let response = {"status": false};
		let selector = "article form [name=\"username\"]";

		if (typeof this.core.config.selectors[this.utils.clean_tag(tag)] !== "undefined") {
			selector = this.core.config.selectors[this.utils.clean_tag(tag)];
		}

		try {
			 await this.core.bot.waitForSelector(selector, {timeout: 5000});
			 this.log.error(tag, `${this.lang.translate("try_check_crash_login_status_true")}`);

			 response.status = false;
		} catch (err) { // if form of login not appear, login is ok
			response.status = true;
		}

		if (response.status) {
			this.log.info(tag, `${this.lang.translate("done")}`);
		} else {
			this.log.error(tag, `${response.error}`);
			this.log.docs("api", tag);
			this.log.stackoverflow(tag, "instagram", response.error);
		}

		return response;
	}

	/**
     * Check twofa crash status (bad pin)
     * =====================
     * Get error if twofa crash
     *
     * @return {Object}  response        - {}
     *         {boolean} response.status - true: successful / false: fail
     *         {string}  response.error  - return error detail if status is false
     *
     * @since: v0.10
     *
     */
	async twofa_crash_status() {
		let tag = "check::twofa_crash_status()";
		this.log.info(tag, `${this.lang.translate("try_check_twofa_crash_status")}`);

		let response = {"status": false};
		let selector = "#twoFactorErrorAlert";
		let text = null;
		let html_response = "";

		if (typeof this.core.config.selectors[this.utils.clean_tag(tag)] !== "undefined") {
			selector = this.core.config.selectors[this.utils.clean_tag(tag)];
		}

		try {
			await this.core.bot.waitForSelector(selector, {timeout: 5000});
			text = await this.core.bot.$(selector);
			if (text !== null) {
				html_response = await this.core.bot.evaluate(body => body.innerHTML, text);
				await text.dispose();

				response.status = false;
				response.error = html_response;
			} else {
				response.status = true;
			}
		} catch (err) { // if html element #twoFactorErrorAlert not exist, twofa is ok
			response.status = true;
		}

		if (response.status) {
			this.log.info(tag, `${this.lang.translate("done")}`);
		} else {
			this.log.error(tag, `${response.error}`);
			this.log.error(tag, `${this.lang.translate("twofa_not_work")}`);
			this.log.docs("api", tag);
			this.log.stackoverflow(tag, "instagram", response.error);
		}

		return response;
	}

	/**
     * Check if twofa is enabled
     * =====================
     * Get status of twofa after login: true = enabled/false = disabled
     *
     * @return {Object}  response        - {}
     *         {boolean} response.status - true: required 2fa / false: 2fa disabled
     *         {string}  response.error  - return error detail if status is false
     *
     * @since: v0.10
     *
     */
	async twofa_required() {
		let tag = "check::twofa_required()";
		this.log.info(tag, `${this.lang.translate("try_check_twofa_login_status")}`);

		let response = {"status": false};
		let selector = "article form input[name=\"verificationCode\"]";

		if (typeof this.core.config.selectors[this.utils.clean_tag(tag)] !== "undefined") {
			selector = this.core.config.selectors[this.utils.clean_tag(tag)];
		}

		try {
			await this.core.bot.waitForSelector(selector, {timeout: 5000});

			if (this.core.config.system.ui === "enabled") {
				this.log.warning(tag, `${this.lang.translate("try_check_twofa_login_status_twofa_enabled_ui")}`);
			} else {
				this.log.warning(tag, `${this.lang.translate("try_check_twofa_login_status_twofa_enabled_cli", {"pin_path": this.core.config.log.path.pin})}`);
			}

			response.status = true;
		} catch (err) { // if input box of pin don't exist: twofa is disabled but not in fail
			response.status = false;
			response.error = err;

		}

		if (response.status) {
			this.log.warning(tag, `${this.lang.translate("twofa_done_action_required")}`);
		} else {
			this.log.info(tag, `${this.lang.translate("twofa_skip")}`);
		}

		return response;
	}

	/**
     * Check if Comment Exist
     * =====================
     * Comment exist?
     *
     * @todo: auto mode for <where> param: detect correct page automatically
     *
     * @param {string} username - your instagram account (optional: default from config)
     *
     * @return {Object}  response        - {}
     *         {boolean} response.status - true: successful / false: fail
     *         {string}  response.error  - return error detail if status is false
     *
     * @since: v0.10
     *
     */
	async comment_exist(username = this.core.config.account.username) {
		let tag = "check::comment_exist()";
		this.log.info(tag, `${this.lang.translate("check_comment_exist")}`);

		let response = {"status": false};
		let selector_username = `article div div a[title="${username}"]`;

		if (typeof this.core.config.selectors[this.utils.clean_tag(tag)] !== "undefined") {
			selector_username = this.core.config.selectors[this.utils.clean_tag(tag)];
		}

		try {
			await this.core.bot.waitForSelector(selector_username, {timeout: 3000});
			let nickname = await this.core.bot.$(selector_username);

			if (nickname !== null) {
				response.status = true;
				response.exist = true;
			} else {
				response.status = true;
				response.exist = false;
				response.error = this.lang.translate("comment_exist");
			}
		} catch (err) {
			response.status = true;
			response.exist = false;
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
   * Check if suspicious login attempt challenge required
   * =====================
   * Get status of suspicious login attempt challenge required after login: true = enabled/false = disabled
   *
   * @return {Object}  response        - {}
   *         {boolean} response.status - true: required challenge / false: challenge disabled
   *         {string}  response.error  - return error detail if status is false
   *
   * @since: v0.10
   *
   */
	async suspicious_login_attempt_challenge_required() {
		let tag = "check::suspicious_login_attempt_challenge_required()";
		this.log.info(tag, `${this.lang.translate("try_check_suspicious_login_attempt_challenge_required_login_status")}`);

		let response = {"status": false};
		let selector = "//p[text()='Suspicious Login Attempt']";

		if (typeof this.core.config.selectors[this.utils.clean_tag(tag)] !== "undefined") {
			selector = this.core.config.selectors[this.utils.clean_tag(tag)];
		}

		try {
			await this.core.bot.waitForSelector(selector, {timeout: 5000});

			response.status = true;
		} catch (err) {
			response.status = false;
			response.error = err;

		}

		if (response.status) {
			this.log.warning(tag, `${this.lang.translate("challenge_required_done_action_required")}`);
		} else {
			this.log.info(tag, `${this.lang.translate("challenge_required_skip")}`);
		}

		return response;
	}

	/**
   * Check if add phone number challenge required is enabled
   * =====================
   * Get status of add phone number challenge required after login: true = enabled/false = disabled
   *
   * @return {Object}  response        - {}
   *         {boolean} response.status - true: required challenge / false: challenge disabled
   *         {string}  response.error  - return error detail if status is false
   *
   * @since: v0.10
   *
   */
	async add_phone_number_challenge_required() {
		let tag = "check::add_phone_number_challenge_required()";
		this.log.info(tag, `${this.lang.translate("try_check_add_phone_number_challenge_required_login_status")}`);

		let response = {"status": false};
		let selector = "//h2[text()='Add Your Phone Number']";

		if (typeof this.core.config.selectors[this.utils.clean_tag(tag)] !== "undefined") {
			selector = this.core.config.selectors[this.utils.clean_tag(tag)];
		}

		try {
			await this.core.bot.waitForSelector(selector, {timeout: 5000});

			response.status = true;
		} catch (err) {
			response.status = false;
			response.error = err;

		}

		if (response.status) {
			this.log.warning(tag, `${this.lang.translate("challenge_required_done_action_required")}`);
		} else {
			this.log.info(tag, `${this.lang.translate("challenge_required_skip")}`);
		}

		return response;
	}
}

module.exports = Check;