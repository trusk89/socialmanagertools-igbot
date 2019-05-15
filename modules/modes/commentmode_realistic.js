/**
 * MODE: commentmode_realistic
 * =====================
 * Goto random hashtag from config list, go to random photo, leave comment, all time in loop.
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

class Commentmode_realistic extends Status {
	constructor() {
		super();
		this.core = core;
		this.LOG_NAME = "commentmode_realistic";
		this.log = new Log(this.LOG_NAME);
		this.lang = new Translate();
		this.utils = new Utils();

		this.local = {};
		this.local.cache_comments = [];
		this.local.cache_hashtags = [];
		this.local.current_hashtag = [];
		this.local.cache_photos_ids = [];
		this.local.current_photo_id = "";
		this.local.cache_photos_ids_profile = [];
		this.local.current_photo_id_profile = "";
		this.local.comment_counter = 12;

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
	 * Likemode superlike Flow
	 * =====================
	 * Run this flow
	 *
	 */
	async flow() {
		let tag = "commentmode_realistic::flow()";
		this.log.info(tag, `${this.lang.translate("loading")}`);

		let alive = {"status": true};

		await this.api.database.init(this.LOG_NAME);

		let bot_seconds_wait_min = this.utils.compute_interval_between_run_in_seconds(this.core.config.bot_mode_options[this.core.config.bot_mode].likeday_min, 12);
		let bot_seconds_wait_max = this.utils.compute_interval_between_run_in_seconds(this.core.config.bot_mode_options[this.core.config.bot_mode].likeday_max, 12);

		do {
			let today = new Date();
			this.log.info(tag, `${this.lang.translate("current_time_night")}: ${parseInt(`${today.getHours()}${today.getMinutes() < 10 ? "0" : ""}${today.getMinutes()}`)}`);

			let is_sleep_night_flag_enabled = this.core.config.bot_mode_options[this.core.config.bot_mode].sleep_night === "enabled";
			let is_day = (parseInt(`${today.getHours()}${today.getMinutes() < 10 ? "0" : ""}${today.getMinutes()}`) >= (this.core.config.bot_mode_options[this.core.config.bot_mode].sleep_end).replace(":", ""));

			if (!is_sleep_night_flag_enabled || is_day) {
				this.log.info(tag, `${this.lang.translate("cache_size")}: ${this.local.cache_hashtags.length}`);

				if (this.local.cache_hashtags.length <= 0) {
					this.local.cache_hashtags = this.core.config.bot_mode_options[this.core.config.bot_mode].instagram_hashtag.slice();
				}

				if (this.local.cache_comments.length <= 0) {
					this.local.cache_comments = this.core.config.bot_mode_options[this.core.config.bot_mode].comments_list.slice();
				}

				this.local.cache_hashtags = this.utils.mix_array(this.local.cache_hashtags);
				this.local.current_hashtag = this.local.cache_hashtags.pop();

				await this.api.goto.hashtag(this.local.current_hashtag);

				await this.utils.sleep(this.utils.random_interval(1, 3));

				let response_read_photos_list = await this.api.read.photos_list("hashtag");
				this.local.cache_photos_ids = this.utils.mix_array(response_read_photos_list.photos_ids);

				this.log.debug(tag, `${this.lang.translate("hashtag_id")}: #${this.local.current_hashtag}`);

				this.local.current_photo_id = this.local.cache_photos_ids.pop();
				await this.api.goto.photo(this.local.current_photo_id);

				await this.utils.sleep(this.utils.random_interval(1, 3));

				let current_comment = null;
				let response_comment = null;
				let response_comment_exist = await this.api.check.comment_exist();
				if (!response_comment_exist.exist) {
					current_comment = (this.utils.mix_array(this.local.cache_comments)).pop();
					response_comment = await this.api.write.comment(current_comment);
					this.local.comment_counter--;
				} else {
					this.log.warning(tag, `${this.lang.translate("comment_exist")}`);
					response_comment = {"status": false, "error": `${this.lang.translate("comment_exist")}`};
					current_comment = "";
				}

				await this.utils.sleep(this.utils.random_interval(1, 3));

				let response_read_user_username = await this.api.read.user_username("picture", "@");

				let json = {
					"account": this.core.config.account.username,
					"photo_id": this.local.current_photo_id,
					"username": response_read_user_username.username,
					"hashtag": `#${this.local.current_hashtag}`,
					"comment_text": `${current_comment}`,
					"status_error": ansi(response_comment.error),
					"status_warning": ansi(response_comment.warning)
				};
				await this.api.database.insert(json);

				if (this.local.comment_counter < 1) {
					this.local.comment_counter = 12;
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

module.exports = Commentmode_realistic;