/**
 * MODE: fdfmode_classic
 * =====================
 * Follow 30 users, and defollow the first followed at 31 follow (in loop). This method is not detected from socialblade or similar software.
 *
 * @contributors: Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
 *
 * @license: This code and contributions have 'MIT License'
 *
 */
const Log = require("../logger/log");
const Translate = require("../commons/translate");
const Api = require("../routes/api");
const Utils = require("../commons/utils");
const Status = require("../logger/state").Status;
const STATE = require("../logger/state").STATE;
const STATE_EVENTS = require("../logger/state").STATE_EVENTS;
const core = require("../core/core");
// const ansi = require("strip-ansi");

class Fdfmode_realistic_location extends Status {
	constructor() {
		super();
		this.core = core;
		this.LOG_NAME = "fdfmode_realistic_location";
		this.log = new Log(this.LOG_NAME);
		this.lang = new Translate();
		this.utils = new Utils();

		this.local = {};
		this.local.cache_locations = [];
		this.local.current_location = [];
		this.local.cache_photos_ids = [];
		this.local.current_photo_id = "";
		this.local.cache_photos_ids_profile = [];
		this.local.current_photo_id_profile = "";
		this.local.followrotate = this.core.config.bot_mode_options[this.core.config.bot_mode].followrotate;

		this.api = {};
		this.api.click = new Api.Click();
		this.api.check = new Api.Check();
		this.api.goto = new Api.Goto();
		this.api.read = new Api.Read();
		this.api.write = new Api.Write();
		this.api.page = new Api.Page();
		this.api.stories = new Api.Stories();
		this.api.database = new Api.Database();
		this.api.analytics = new Api.Analytics();
	}

	/**
	 * Fdfmode classic Flow
	 * =====================
	 * Run this flow
	 *
	 */
	async flow() {
		let tag = "fdfmode_realistic_location::flow()";
		this.log.info(tag, `${this.lang.translate("loading")}`);

		let alive = {"status": true};

		await this.api.database.init(this.LOG_NAME);

		let bot_seconds_wait_min = this.utils.compute_interval_between_run_in_seconds(parseInt(this.core.config.bot_mode_options[this.core.config.bot_mode].followday - 100), 12);
		let bot_seconds_wait_max = this.utils.compute_interval_between_run_in_seconds(this.core.config.bot_mode_options[this.core.config.bot_mode].followday, 12);

		do {
			let today = new Date();
			this.log.info(tag, `${this.lang.translate("current_time_night")}: ${parseInt(`${today.getHours()}${today.getMinutes() < 10 ? "0" : ""}${today.getMinutes()}`)}`);

			let is_sleep_night_flag_enabled = this.core.config.bot_mode_options[this.core.config.bot_mode].sleep_night === "enabled";
			let is_day = (parseInt(`${today.getHours()}${today.getMinutes() < 10 ? "0" : ""}${today.getMinutes()}`) >= (this.core.config.bot_mode_options[this.core.config.bot_mode].sleep_end).replace(":", ""));

			if (!is_sleep_night_flag_enabled || is_day) {
				this.log.info(tag, `${this.lang.translate("cache_size")}: ${this.local.cache_locations.length}`);

				if (this.local.cache_locations.length <= 0) {
					this.local.cache_locations = this.core.config.bot_mode_options[this.core.config.bot_mode].instagram_location.slice();
				}

				this.local.cache_locations = this.utils.mix_array(this.local.cache_locations);
				this.local.current_location = this.local.cache_locations.pop();

				await this.api.goto.location(this.local.current_location);

				await this.utils.sleep(this.utils.random_interval(1, 3));

				let response_read_photos_list = await this.api.read.photos_list("location");
				this.local.cache_photos_ids = this.utils.mix_array(response_read_photos_list.photos_ids);

				this.log.debug(tag, `${this.lang.translate("location_id")}: #${this.local.current_location}`);

				this.local.current_photo_id = this.local.cache_photos_ids.pop();
				await this.api.goto.photo(this.local.current_photo_id);

				await this.utils.sleep(this.utils.random_interval(1, 3));

				let response_read_user_username = await this.api.read.user_username("picture");

				await this.api.goto.profile(response_read_user_username.username);

				let response_click_follow = null;
				let response_click_defollow = null;
				if (this.core.config.bot_mode_options[this.core.config.bot_mode].userwhitelist.includes(response_read_user_username.username) || this.core.config.bot_mode_options[this.core.config.bot_mode].userwhitelist.includes(`@${response_read_user_username.username}`)) {
					this.log.info(tag, this.lang.translate("follow_whitelist_skipped", {"username": response_read_user_username.username}));
				} else {
					await this.utils.sleep(this.utils.random_interval(1, 3));

					response_click_follow = await this.api.click.follow();
					if (response_click_follow.status) {
						let json = {
							"account": this.core.config.account.username,
							"photo_id": this.local.current_photo_id,
							"username": `@${response_read_user_username.username}`,
							"location": `#${this.local.current_location}`,
							"type": "follow",
						};
						await this.api.database.insert(json);
					}

					await this.utils.sleep(this.utils.random_interval(1, 3));

					response_click_defollow = await this.api.click.defollow();
					if (response_click_defollow.status) {
						let json_search = {
							"account": this.core.config.account.username,
							"username": `@${response_read_user_username.username}`,
							"type": "follow",
						};

						let json_update = {
							"type": "defollow",
						};
						await this.api.database.update(json_search, json_update);
					}
				}

				if (this.local.followrotate < 1) {
					this.local.followrotate = 12;
					this.log.info(tag, this.lang.translate("finish_fast_like", {"time": `${this.utils.decimal_to_minutes(bot_seconds_wait_max / 60)}-${this.utils.decimal_to_minutes(bot_seconds_wait_min / 60)}`}));
					await this.utils.sleep(this.utils.random_interval(bot_seconds_wait_max, bot_seconds_wait_min));
				}
			} else {
				this.log.info(tag, this.lang.translate("is_night_bot_sleep"));
				await this.utils.sleep(this.utils.random_interval(60 * 4, 60 * 5));

				alive = await this.utils.keep_alive();
				if (alive == false) {
					break;
				}
			}

			alive = await this.api.page.keep_alive();

			this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.OK);
		} while (alive.status);

		this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.ERROR);

		return false;
	}

}

module.exports = Fdfmode_realistic_location;