/**
 * Utils
 * =====================
 * Logger and other functions...
 *
 * @author:  Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
 * @license: This code and contributions have 'MIT License'
 *
 */
const fse = require("fs-extra");
const request = require("request");
const Log = require("./../logger/log");
const Translate = require("./../commons/translate");
const core = require("./../core/core");

class Utils {
	constructor () {
		this.core = core;

		this.LOG_NAME = "utils";
		this.log = new Log(this.LOG_NAME);
		this.lang = new Translate();
	}

	/**
     * Donate
     * =====================
     * Patreon, ko-fi, paypal and sponsors links
     *
     */
	donate () {
		let tag = "utils::donate()";
		this.log.sponsor(tag, `${this.lang.translate("bot_work_support")}`);
		this.log.sponsor(tag, `${this.lang.translate("bot_work_support_details_1")}`);
		this.log.sponsor(tag, `${this.lang.translate("bot_work_support_details_2")}`);
		this.log.sponsor(tag, `${this.lang.translate("bot_work_support_details_3")}`);
		this.log.sponsor(tag, `${this.lang.translate("bot_work_support_details_4")}`);
		this.log.sponsor(tag, `${this.lang.translate("bot_work_support_details_5")}`);
		this.log.sponsor(tag, `${this.lang.translate("bot_work_support_details_6")}`);
		this.log.sponsor(tag, `${this.lang.translate("bot_work_support_patreon")}`);
		this.log.sponsor(tag, `${this.lang.translate("bot_work_support_paypal")}`);
		this.log.sponsor(tag, `${this.lang.translate("bot_work_support_kofi")}`);
		this.log.sponsor(tag, `${this.lang.translate("bot_work_support_sponsors")}`);
		this.log.sponsor(tag, `${this.lang.translate("loading")}`);
	}

	/**
     * Check alerts
     * =====================
     * Download alerts
     *
     */
	async check_alerts () {
		let tag = "utils::check_alerts()";

		request.get("https://api.socialmanager.tools/v2/bot/instagram/alert/", function (err, res, json_alert) {
			if (err || res.statusCode !== 200) {
				this.log.error(tag, `${this.lang.translate("api_connection_error")}`);
				this.log.error(tag, `${err}`);
			} else {
				let json = JSON.parse(json_alert);
				for (let i = 0; i < json.messages.length; i++) {
					this.log.warning(tag, json.messages[i]);
				}
			}
		}.bind(this));
	}

	/**
     * Check sponsors
     * =====================
     * Download sponsors ads
     *
     */
	async check_sponsors () {
		let tag = "utils::check_sponsors()";

		request.get("https://api.socialmanager.tools/v2/bot/instagram/sponsors/", function (err, res, json_sponsors) {
			if (err || res.statusCode !== 200) {
				this.log.error(tag, `${this.lang.translate("api_connection_error")}`);
				this.log.error(tag, `${err}`);
			} else {
				let json = JSON.parse(json_sponsors);
				for (let i = 0; i < json.sponsors.length; i++) {
					this.log.sponsor(tag, json.sponsors[i]);
				}
			}
		}.bind(this));
	}

	/**
     * Check updates
     * =====================
     * Bot is updated? Yes/no
     *
     * @param {string} version - version id from package.json (mandatory)
     *
     */
	async check_updates (version) {
		let tag = "utils::check_updates()";

		request.get("https://api.socialmanager.tools/v2/bot/instagram/version/", function (err, res, last_release) {
			if (err || res.statusCode !== 200) {
				this.log.error(tag, `${this.lang.translate("api_connection_error")}`);
				this.log.error(tag, err);
				this.log.warning(tag, `Bot is updated! :D`);
			} else {
				last_release = JSON.parse(last_release);
				if (version !== last_release.master.version) {
					this.log.warning(tag, `${this.lang.translate("update_available", {"new_version": last_release.master.version, "current_version": version})}`);
				} else {
					this.log.info(tag, `${this.lang.translate("update_ok")}`);
				}
			}
		}.bind(this));
	}

	/**
     * Init all empty files and directory.
     * =====================
     * This fix file system errors at boot
     *
     */
	create_files () {
		let tag = "utils::create_files()";

		if (!fse.existsSync(this.core.config.log.path.pin)) {
			fse.outputFileSync(this.core.config.log.path.pin, "123456");
			this.log.info(tag, `${this.core.config.log.path.pin} ${this.lang.translate("created")}`);
		} else {
			fse.outputFileSync(this.core.config.log.path.pin, "123456");
			this.log.info(tag, `${this.core.config.log.path.pin} ${this.lang.translate("exist")}`);
		}

		if (!fse.existsSync(this.core.config.log.path.debug_log)) {
			fse.outputFileSync(this.core.config.log.path.debug_log, "");
			this.log.info(tag, `${this.core.config.log.path.debug_log} ${this.lang.translate("created")}`);
		} else {
			this.log.info(tag, `${this.core.config.log.path.debug_log} ${this.lang.translate("exist")}`);
		}
		if (!fse.existsSync(this.core.config.log.path.error_log)) {
			fse.outputFileSync(this.core.config.log.path.error_log, "");
			this.log.info(tag, `${this.core.config.log.path.error_log} ${this.lang.translate("created")}`);
		} else {
			this.log.info(tag, `${this.core.config.log.path.error_log} ${this.lang.translate("exist")}`);
		}

		if (!fse.existsSync(`${this.core.config.log.path.screenshots}index.html`)) {
			fse.outputFileSync(`${this.core.config.log.path.screenshots}index.html`, "<html></html>");
			this.log.info(tag, `${this.core.config.log.path.screenshots} ${this.lang.translate("created")}`);
		} else {
			this.log.info(tag, `${this.core.config.log.path.screenshots} ${this.lang.translate("exist")}`);
		}
	}

	/**
     * Compute interval between run
     * =====================
     * Calculate the waiting seconds so as not to exceed the limits of like/comments/follow/defollow in 24 hours
     *
     * @param {int} n_action_daily - example: 900 like, 500 comments, etc... (mandatory)
     * @param {int} delta          - likes or comments consecutively (mandatory)
     *
     * @return {int} sec - seconds so as not to exceed the limits
     *
     */
	compute_interval_between_run_in_seconds (n_action_daily, delta) {
		return parseFloat((1440 * delta / n_action_daily) * 60);
	}

	/**
     * Random
     * =====================
     * Random number between two numbers
     *
     * @param {int} min - start value (mandatory)
     * @param {int} max - end value (mandatory)
     *
     * @return {int} number - middle random number from input min/max interval
     *
     */
	random_interval (min, max) {
		return (Math.floor(Math.random() * (max - min + 1)) + min) * 1000;
	}

	/**
     * Decimal to minutes
     * =====================
     * Convert decimal number to minutes
     *
     * @param {float} decimal - float number or string, example: 3.5 (mandatory)
     *
     * @return {string} number - result is 3:30
     *
     */
	decimal_to_minutes (decimal) {
		var sign = decimal < 0 ? "-" : "";
		var min = Math.floor(Math.abs(decimal));
		var sec = Math.floor((Math.abs(decimal) * 60) % 60);

		return `${sign + (min < 10 ? "0" : "") + min}:${sec < 10 ? "0" : ""}${sec}`;
	}

	/**
     * Mix array element
     * =====================
     * Randomize array values
     *
     * @param {Array} arr - array (mandatory)
     *
     * @return {Array} arr - mixed array
     *
     */
	mix_array (arr) {
		return arr.sort(() => Math.random() - 0.5);
	}

	/**
     * Sleep
     * =====================
     * Zzz
     *
     * @param {int} sec - seconds to need sleep
     *
     * @return {Promise<Promise>} - async wait
     *
     */
	sleep (sec) {
		return new Promise(resolve => setTimeout(resolve, sec));
	}

	/**
     * Clean Tag name
     * =====================
     * Remove specials chars
     *
     * @param {string} tag - function tag: className::functionName()
     *
     * @return {string} - clean name without symbols: className_functionName
     *
     */
	clean_tag (tag) {
		tag = tag.replace(/::/g, "_");
		tag = tag.replace(/()/g, "");
		tag = tag.replace(/ /g, "_");

		return tag;
	}

	/**
     * Default config.js
     * =====================
     * Get default value if config.js is not updated from config.js.tpl
     *
     * @param {Object} config - this.core.config or require("./config")
     *
     * @return {Object} config - fixed
     *
     */
	fix_config (config) {
		let tag = "utils::fix_config()";

		if (typeof config.system === "undefined") {
			config.debug = true;
			this.log.warning(tag, `${this.lang.translate("config_need_update")}`);
			this.log.warning(tag, `${this.lang.translate("config_trylegacy_update")}`);
		}

		return config;
	}
}

module.exports = Utils;