/**
 * MODE: Likemode_competitor_users
 * =====================
 * Select account, get random 20 followers, like 20 photo and sleep 15-20min.
 *
 * @contributors: Ilya Chubarov [@agoalofalife] <agoalofalife@gmail.com>
 *                Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
 *
 * @license:    This code and contributions have 'MIT License'
 *
 */
const Log = require("./../logger/log");
const Translate = require("./../commons/translate");
const Api = require("./../routes/api");
const Utils = require("./../commons/utils");
const Status = require("./../logger/state").Status;
// const STATE = require("./../logger/state").STATE;
// const STATE_EVENTS = require("./../logger/state").STATE_EVENTS;
const core = require("./../core/core");
// const ansi = require("strip-ansi");

class Likemode_competitor_users extends Status {
	constructor() {
		super();
		this.core = core;

		this.local = {};
		this.local.account = this.core.config.likemode_competitor_users.account;
		this.local.url_instagram = "https://www.instagram.com/";
		this.local.account_url = `${this.local.url_instagram}${this.local.account}`;
		this.local.hashtags_cache = [];

		this.LOG_NAME = "like_competitor_users";
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

}

module.exports = Likemode_competitor_users;