/**
 * API: Goto
 * =====================
 * Go to profile page, go to photo, go to url... etc...
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

class Goto {
	constructor(LOG_NAME = "api") {
		this.core = core;
		this.LOG_NAME = LOG_NAME;

		this.log = new Log(this.LOG_NAME);
		this.lang = new Translate();
		this.utils = new Utils();
	}

	/**
     * Photo
     * =====================
     * Goto photo page
     *
     * @param {string} id_hash - string of id hash of photo (mandatory)
     *
     * @return {boolean} status - true: successful / false: fail
     *         {string}  response.error - if status is false return error details
     *
     * @since: v0.10
     *
     */
	async photo(id_hash) {
		let tag = "goto::photo()";
		this.log.info(tag, `${this.lang.translate("try_goto_photo_page")}`);

		let response = {"status": false};

		try {
			await this.core.bot.goto(`https://www.instagram.com/p/${id_hash}/`);

			response.status = true;
		} catch (err) {
			response.status = false;
			response.error = err;
		}

		if (response.status) {
			this.log.info(tag, `${this.lang.translate("photo_id")}: ${id_hash}`);
			this.log.info(tag, `${this.lang.translate("done")}`);
		} else {
			this.log.error(tag, `${response.error}`);
			this.log.docs("api", tag);
			this.log.stackoverflow(tag, "puppeteer", response.error);
		}

		return response;
	}

	/**
     * Hashtag
     * =====================
     * Goto hashtag page
     *
     * @param {string} hashtag - string of hashtag, work with # or without # prefix (mandatory)
     *
     * @return {boolean} status - true: successful / false: fail
     *         {string} response.error - if status is false return error details
     *
     * @since: v0.10
     *
     */
	async hashtag(hashtag) {
		let tag = "goto::hashtag()";
		this.log.info(tag, `${this.lang.translate("try_goto_hashtag_page")}`);

		let response = {"status": false};

		try {
			hashtag = hashtag.replace(/#/g, "");

			await this.core.bot.goto(`https://www.instagram.com/explore/tags/${hashtag}/`);

			response.status = true;
		} catch (err) {
			response.status = false;
			response.error = err;
		}

		if (response.status) {
			this.log.info(tag, `#${hashtag}`);
			this.log.info(tag, `${this.lang.translate("done")}`);
		} else {
			this.log.error(tag, `${response.error}`);
			this.log.docs("api", tag);
			this.log.stackoverflow(tag, "puppeteer", response.error);
		}

		return response;
	}

	/**
     * Location
     * =====================
     * Goto gps location page
     *
     * @param {int}  gps - location instagram id (mandatory)
     *
     * @return {boolean} status         - true: successful / false: fail
     *         {string}  response.error - if status is false return error details
     *
     * @since: v0.10
     *
     */
	async location(gps) {
		let tag = "goto::location()";
		this.log.info(tag, `${this.lang.translate("try_goto_gps_page")}`);

		let response = {"status": false};

		try {
			await this.core.bot.goto(`https://www.instagram.com/explore/locations/${gps}/`);

			response.status = true;
		} catch (err) {
			response.status = false;
			response.error = err;
		}

		if (response.status) {
			this.log.info(tag, `GPS ID: ${gps}`);
			this.log.info(tag, `${this.lang.translate("done")}`);
		} else {
			this.log.error(tag, `${response.error}`);
			this.log.docs("api", tag);
			this.log.stackoverflow(tag, "puppeteer", response.error);
		}

		return response;
	}

	/**
 * Profile
* =====================
* Goto profile of user
 *
 * @param nickname
 * @param {string} profile - string of nickname, work with @ or without @ prefix (mandatory)
 * @return {boolean} status         - true: successful / false: fail
 * {string}  response.error - if status is false return error details
 * @since: v0.10
 */
	async profile(nickname) {
		let tag = "goto::profile()";
		this.log.info(tag, `${this.lang.translate("try_goto_profile_page")}`);

		let response = {"status": false};

		nickname = nickname.replace(/@/g, "");

		try {
			await this.core.bot.goto(`https://www.instagram.com/${nickname}/`);

			response.status = true;
		} catch (err) {
			response.status = false;
			response.error = err;
		}

		if (response.status) {
			this.log.info(tag, `@${nickname}`);
			this.log.info(tag, `${this.lang.translate("done")}`);
		} else {
			this.log.error(tag, `${response.error}`);
			this.log.docs("api", tag);
			this.log.stackoverflow(tag, "puppeteer", response.error);
		}

		return response;
	}

	/**
     * Login
     * =====================
     * Goto login page
     *
     * @return {boolean} status         - true: successful / false: fail
     *         {string}  response.error - if status is false return error details
     *
     * @since: v0.10
     *
     */
	async login() {
		let tag = "goto::login()";
		this.log.info(tag, `${this.lang.translate("try_goto_login_page")}`);

		let response = {"status": false};

		try {
			await this.core.bot.goto("https://www.instagram.com/accounts/login/");

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

module.exports = Goto;