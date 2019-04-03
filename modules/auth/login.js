/**
 * Login Flow
 * =====================
 * Open browser, set user/pass and try login
 *
 * @author:  Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
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

class Login extends Status {
	constructor () {
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
     * Login Flow
     * =====================
     *
     */
	async flow () {
		let tag = "login::flow()";
		this.log.info(tag, `${this.lang.translate("loading")}`);

		let response = {"status": false};

		await this.api.goto.login();

		await this.utils.sleep(this.utils.random_interval(1, 3));

		await this.api.write.login_username();

		await this.utils.sleep(this.utils.random_interval(1, 3));

		await this.api.write.login_password();

		await this.utils.sleep(this.utils.random_interval(1, 3));

		await this.api.click.login_form_submit();

		await this.utils.sleep(this.utils.random_interval(1, 3));

		response = await this.api.check.login_status();

		await this.utils.sleep(this.utils.random_interval(1, 3));

		if (response.status) {
			response = await this.api.check.login_crash_status();
		}

		await this.utils.sleep(this.utils.random_interval(1, 3));

		if (response.status) {
			this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.OK);
		} else {
			this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.ERROR);
		}

		await this.api.page.screenshot(this.LOG_NAME, this.utils.clean_tag(tag));

		return response;
	}
}

module.exports = Login;