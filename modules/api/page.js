/**
 * API: Page
 * =====================
 * Scroll page, resize page, etc...
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

class Page {
	constructor(LOG_NAME = "api") {
		this.core = core;
		this.LOG_NAME = LOG_NAME;

		this.log = new Log(this.LOG_NAME);
		this.lang = new Translate();
		this.utils = new Utils();
	}

	/**
     * Scroll
     * =====================
     * Get array of photos url
     *
     * @todo: auto mode for <where> param: detect correct page automatically
     *
     * @param {string}  selector - what you want scroll, available params: window, string of selector (optional: default window)
     * @param {int}     counter -  - number of times when the scrolling occurs (optional: default 5)
     * @param {pixel}   height -   - pixel you want scroll (optional: default 5000)
     *
     * @return {Promise<Promise>} - async wait
     *
     * @since: v0.10
     *
     */
	async scroll(selector = "window", counter = 5, height = 5000) {
		let tag = "page::scroll()";
		this.log.info(tag, `${this.lang.translate("try_scroll")}`);

		return this.core.bot.evaluate(() => {
			return new Promise((resolve) => {
				let timer = setInterval(() => {

					if (selector === "window") {
						window.scrollBy(0, height);
					} else {
						document.querySelector("selector").scrollBy(0, height);
					}

					if (counter <= 0) {
						clearInterval(timer);
						resolve();

						this.log.info(tag, `${this.lang.translate("done")}`);
					} else {
						counter--;

						this.log.info(tag, `${this.lang.translate("done_continue")}`);
					}
				}, 5000);
			});
		});
	}

	/**
     * Kill Process if browser page is closed
     * =====================
     * Exit from node or bot
     *
     * @return {Object}  response        - {}
     *         {boolean} response.status - true: successful / false: fail
     *         {string}  response.error  - return error detail if status is false
     *
     * @since: v0.10
     *
     */
	async keep_alive() {
		let tag = "page::keep_alive()";
		this.log.info(tag, `${this.lang.translate("try_keep_alive")}`);
		let response = {"status": false};

		let pages = null;

		try {
			pages = (await this.core.browser.pages()).map(t => t.url());

			if (pages.length == 2) {
				response.status = true;
			} else {
				response.status = false;
			}
		} catch (err) {
			response.status = false;
			response.error = err;
		}

		if (response.status) {
			this.log.info(tag, `${this.lang.translate("done")}`);
		} else {
			this.log.error(tag, `${this.lang.translate("shutdown_wait_30sec")}`);
			this.log.error(tag, `${response.error}`);
			this.log.docs("api", tag);
			this.log.stackoverflow(tag, "puppeteer", response.error);
		}

		return response;
	}

	/**
 * Screenshot
* =====================
* Save screenshot from chrome
 *
 * @param {string} func - name of function when screenshot happen (mandatory)
 * @param {string} name - name of screenshot, auto replace space with underscore (mandatory)
 * @param {string} path - screenshot file path (optional: default from config)
 * @param username
 * @param {string} name - username (optional: default from config)
 * @return {Object}  response        - {}
 * {boolean} response.status - true: successful / false: fail
 * {string}  response.error  - return error detail if status is false
 * @since: v0.10
 */
	async screenshot(func, name, path = this.core.config.log.path.screenshots, username = this.core.config.account.username) {
		let tag = "page::screenshot()";
		this.log.info(tag, `${this.lang.translate("try_get_screenshot")}`);
		let response = {"status": false};

		path = path.replace(/ /g, "_");

		if (this.core.config.log.screenshot === "enabled") {
			try {
				await this.core.bot.screenshot({path: `${path + username}_${func}_${name}.jpg`});

				response.status = true;
			} catch (err) {
				response.status = false;
				response.error = err;
			}

			if (response.status) {
				this.log.info(tag, `${this.lang.translate("done_cheese")}`);
			} else {
				this.log.error(tag, `${response.error}`);
				this.log.docs("api", tag);
				this.log.stackoverflow(tag, "puppeteer", response.error);
			}
		} else {
			response.status = false;
			response.error = this.lang.translate("screenshot_disabled");
			this.log.warning(tag, `${response.error}`);
			this.log.docs("api", tag);
		}

		return response;
	}
}

module.exports = Page;