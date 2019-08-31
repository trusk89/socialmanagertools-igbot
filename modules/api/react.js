const Log = require("./../logger/log");
const Translate = require("./../commons/translate");
const Utils = require("./../commons/utils");
const core = require("./../core/core");

class React {
	constructor(LOG_NAME = "api") {
		this.core = core;
		this.LOG_NAME = LOG_NAME;
		this.log = new Log(this.LOG_NAME);
		this.lang = new Translate();
		this.utils = new Utils();
	}

	/**
	 * React
	 * =====================
	 * Сheck for recent activity
	 *
	 * @return {boolean} status         - true: successful / false: fail
	 *         {string}  response.about - the statistics of action
	 *         {string}  response.error - if status is false return error details
	 *
	 */

	async react() {
		let tag = "Posting::react()";
		this.log.info(tag, `${this.lang.translate("try_react")}`);
		let response = {"status": false, "react": {}};

		let about = {};
		let selector = "section nav:nth-child(2) div div:nth-child(3) div:nth-child(2) div span:nth-child(2)";
		let selector_name = "section nav:nth-child(2) div div:nth-child(3) div:nth-child(2) div span:nth-child(1)";

		try {
			await this.core.bot.waitForSelector(selector, {timeout: 5000});
			await this.core.bot.waitForSelector(selector_name, {timeout: 5000});
			var element_name = await this.core.bot.$$eval(selector_name, elements => elements.map((a) => a.className));
			var element = await this.core.bot.$$eval(selector, elements => elements.map((a) => a.textContent));
			element_name.forEach(async(a, b) => about[this.react_filter(a)] = element[b]);

			response.react = about;

			await this.core.bot.goto("https://www.instagram.com/accounts/activity/");
			let selector_event = "main div[role=\"button\"] div.iTMfC button";
			await this.core.bot.waitForSelector(selector_event, {timeout: 5000});
			await this.core.bot.$eval(selector_event, button => button.click());

			response.status = true;
		} catch (err) {
			response.status = false;
			response.error = err;
		}

		if (response.status) {
			this.log.info(tag, `${this.lang.translate("react_ok")}`);
			this.log.info(tag, `${this.lang.translate("done")}`);
		} else if (typeof response.error !== "undefined") {
			this.log.error(tag, `${this.lang.translate("react_ok")}`);
			this.log.error(tag, `${response.error}`);
			this.log.docs("api", tag);
			this.log.stackoverflow(tag, "puppeteer", response.error);
		}

		return response;
	}

	react_filter(filter) {
		if (filter.includes("ships")) {
			return "follow";
		}
		if (filter.includes("Like")) {
			return "like";
		}
		if (filter.includes("Comment")) {
			return "comment";
		}
		return filter;
	}

}

module.exports = React;