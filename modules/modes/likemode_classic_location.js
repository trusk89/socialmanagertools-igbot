/**
 * MODE: likemode_classic_location
 * =====================
 * Goto random location from config list and like 1 photo and sleep X min in night.
 *
 * @contributors: Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
 *
 * @license: This code and contributions have 'MIT License'
 *
 */
const Log = require("./../logger/log");
const Translate = require("./../commons/translate");
const Api = require("./../routes/api");
const Utils = require("./../commons/utils");
const Status = require("./../logger/state").Status;
const STATE = require("./../logger/state").STATE;
const STATE_EVENTS = require("./../logger/state").STATE_EVENTS;
const core = require("./../core/core");
const ansi = require("strip-ansi");

class Likemode_classic_location extends Status {
	constructor() {
		super();
		this.core = core;
		this.LOG_NAME = "likemode_classic_location";
		this.log = new Log(this.LOG_NAME);
		this.lang = new Translate();
		this.utils = new Utils();

		this.local = {};
		this.local.cache_locations = [];
		this.local.current_location = [];
		this.local.cache_photos_ids = [];
		this.local.current_photo_id = "";
		this.local.like_counter = 1;

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
	 * Likemode Realistic Flow
	 * =====================
	 * Run this flow
	 *
	 */
	async flow() {
		let tag = "likemode_classic_location::flow()";
		this.log.info(tag, `${this.lang.translate("loading")}`);

		let alive = {"status": true};

		await this.api.database.init(this.LOG_NAME);

		let bot_seconds_wait_min = this.utils.compute_interval_between_run_in_seconds(this.core.config.bot_mode_options[this.core.config.bot_mode].likeday_min, 1);
		let bot_seconds_wait_max = this.utils.compute_interval_between_run_in_seconds(this.core.config.bot_mode_options[this.core.config.bot_mode].likeday_max, 1);

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

				if (this.local.like_counter < 1 || this.local.cache_photos_ids <= 0) {
					this.local.cache_locations = this.utils.mix_array(this.local.cache_locations);
					this.local.current_location = this.local.cache_locations.pop();

					await this.api.goto.location(this.local.current_location);

					await this.utils.sleep(this.utils.random_interval(1, 3));

					let response_read_photos_list = await this.api.read.photos_list("location");
					this.local.cache_photos_ids = response_read_photos_list.photos_ids;
				}

				this.log.debug(tag, `${this.lang.translate("location_id")}: #${this.local.current_location}`);

				this.local.current_photo_id = this.local.cache_photos_ids.pop();
				await this.api.goto.photo(this.local.current_photo_id);

				await this.utils.sleep(this.utils.random_interval(1, 3));

				let response_heart = await this.api.click.heart();

				if (response_heart.status) {
					this.local.like_counter--;
					this.log.debug(tag, `local.like_counter: ${this.local.like_counter}`);
				}

				await this.utils.sleep(this.utils.random_interval(1, 3));

				let response_read_user_username = await this.api.read.user_username("picture", "@");

				let json = {
					"account": this.core.config.account.username,
					"photo_id": this.local.current_photo_id,
					"username": response_read_user_username.username,
					"location": `${this.local.current_location}`,
					"status": response_heart.status === true ? "<3" : "</3",
					"status_error": ansi(response_heart.error),
					"status_warning": ansi(response_heart.warning)
				};
				await this.api.database.insert(json);

				if (this.local.like_counter < 1) {
					this.local.like_counter = 1;
					this.log.info(tag, this.lang.translate("finish_like", {"time": `${this.utils.decimal_to_minutes(bot_seconds_wait_max / 60)}-${this.utils.decimal_to_minutes(bot_seconds_wait_min / 60)}`}));
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

module.exports = Likemode_classic_location;