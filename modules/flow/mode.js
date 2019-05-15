/**
 * Flow: Mode
 * =====================
 * Go to mode from config
 *
 * @contributors: Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
 *
 * @license: This code and contributions have 'MIT License'
 *
 */
const Log = require("./../logger/log");
const Translate = require("./../commons/translate");
const Utils = require("./../commons/utils");
const Status = require("./../logger/state").Status;
const STATE = require("./../logger/state").STATE;
const STATE_EVENTS = require("./../logger/state").STATE_EVENTS;
const Modes = require("./../routes/modes");
const core = require("./../core/core");

class Mode extends Status {
	constructor() {
		super();
		this.core = core;
		this.LOG_NAME = "login";
		this.log = new Log(this.LOG_NAME);
		this.lang = new Translate();
		this.utils = new Utils();
	}

	/**
     * Mode Flow
     * =====================
     * Set and start mode
     *
     * @return {boolean} status         - true: successful / false: fail
     *         {string}  response.error - if status is false return error details
     *
     */
	async flow() {
		let tag = "mode::flow()";
		this.log.info(tag, `${this.lang.translate("try_start_mode")}`);

		let response = {"status": false};
		let current_mode = this.core.config.bot_mode.charAt(0).toUpperCase() + this.core.config.bot_mode.slice(1);

		try {
			let mode = new Modes[current_mode];
			if (typeof mode !== "undefined") {
				await mode.flow();
				this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.OK);
				response.status = true;
			} else {
				this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.ERROR);
				response.status = false;
				response.error = this.lang.translate("mode_not_exist", {"mode": current_mode});
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
			this.log.stackoverflow(tag, "social-manager-tools", response.error);
		}

		return response;
	}
}

module.exports = Mode;