/**
 * Two Factor Authentication (2FA) Flow
 * =====================
 * Flow for pin request after login
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

class Twofa extends Status {
	constructor() {
		super();
		this.core = core;
		this.LOG_NAME = "login";
		this.log = new Log(this.LOG_NAME);
		this.lang = new Translate();
		this.utils = new Utils();

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
     * 2FA (Enabled) Flow
     * =====================
     *
     */
	async flow() {
		let tag = "twofa::flow()";
		this.log.info(tag, `${this.lang.translate("loading")}`);

		let response = {"status": false};

		response = await this.api.check.twofa_required();

		if (response.status) {
			response = await this.api.read.twofa_pin();
			response = await this.api.write.twofa_pin(response.pin);
			response = await this.api.click.twofa_form_submit();
			response = await this.api.check.twofa_crash_status();
		} else { // skip twofa because is disabled
			response = {"status": true};

		}

		if (response.status) {
			this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.OK);
		} else {
			this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.ERROR);
		}

		return response;
	}

}

module.exports = Twofa;