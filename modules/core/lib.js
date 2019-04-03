/**
 * Social Manager Tools: Instagram Bot API
 * =====================
 * Scraping instagram website with love and nodejs
 *
 * @author:  Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
 *
 * @license: This code and contributions have 'MIT License'
 *
 * @link:    Homepage: https://socialmanager.tools
 *           Docs:     https://docs.socialmanager.tools/README.md
 *           NPM:      https://www.npmjs.com/package/socialmanagertools-igbot
 *           GitHub:   https://github.com/social-manager-tools/socialmanagertools-igbot
 *
 */
const Puppeteer = require("puppeteer");
const VERSION = require("./../commons/version");
const Api = require("./../routes/api");
const Auth = require("./../routes/auth");
const Flow = require("./../routes/flow");
const Translate = require("./../commons/translate");
const Utils = require("./../commons/utils");
const Log = require("./../logger/log");
const core = require("./../core/core");

class Bot {
	constructor (config) {
		this.core = core;
		this.core.config = config;

		this.LOG_NAME = "start";
		this.log = new Log(this.LOG_NAME);
		this.lang = new Translate();
		this.utils = new Utils();
		this.api_manager = {};
	}

	/**
	 * Initialize API
	 * =====================
	 * API for developers
	 *
	 * @link: http://docs.socialmanager.tools/igbot/api/README.md
	 *
	 * @return {Object} api - create your bot
	 *
	 */
	async api () {
		this.api_manager.click = new Api.Click();
		this.api_manager.check = new Api.Check();
		this.api_manager.goto = new Api.Goto();
		this.api_manager.read = new Api.Read();
		this.api_manager.write = new Api.Write();
		this.api_manager.page = new Api.Page();
		this.api_manager.stories = new Api.Stories();
		this.api_manager.database = new Api.Database();
		this.api_manager.analytics = new Api.Analytics();
		this.api_manager.mode = new Flow.Mode();
		this.api_manager.login = new Auth.Login();
		this.api_manager.twofa = new Auth.Twofa();

		return this.api_manager;
	}

	/**
	 * Initialize puppeteer and app
	 * =====================
	 * Set config options, check updates and integrity of bot
	 *
	 */
	async start () {
		this.core.config = await this.utils.fix_config(this.core.config);
		this.utils.donate();
		this.utils.check_updates(VERSION);
		this.utils.check_sponsors();
		this.utils.check_alerts();
		this.utils.create_files();

		if (this.core.config.proxy.server !== "") {
			this.core.config.puppeteer.chrome_options.push(`--proxy-server=${this.core.config.proxy.server}:${this.core.config.proxy.port}`);
		}

		if (this.core.config.puppeteer.chrome_executable_path === "") {
			this.core.browser = await Puppeteer.launch({
				headless: this.core.config.puppeteer.chrome_headless === "enabled" ? true : false,
				args: this.core.config.puppeteer.chrome_options,
				defaultViewport: {"width": 1024, "height": 768}
			});
		} else {
			this.core.browser = await Puppeteer.launch({
				headless: this.core.config.puppeteer.chrome_headless === "enabled" ? true : false,
				args: this.core.config.puppeteer.chrome_options,
				executablePath: this.core.config.puppeteer.chrome_executable_path,
				defaultViewport: {"width": 1024, "height": 768}
			});
		}
		this.core.bot = await this.core.browser.newPage();
		await this.core.bot.setExtraHTTPHeaders({"Accept-Language": this.core.config.system.language});
		await this.core.bot.setViewport({"width": 1024, "height": 768});
		// TODO: this.utils.update_puppeteer(this.core.browser.userAgent());
		await this.core.bot.setUserAgent(this.core.config.puppeteer.chrome_useragent === "" ? (await this.core.browser.userAgent()).replace("Headless", "") : this.core.config.puppeteer.chrome_useragent);
	}

	/**
	 * API: stop()
	 * =====================
	 * if you want stop bot, this method add new tab and utils check if tabs are more than > 2 and kill chrome
	 *
	 */
	async stop () {
		await this.core.browser.newPage();
		await this.core.browser.close();
	}
}

module.exports = Bot;