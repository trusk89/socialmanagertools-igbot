/**
 * Core
 * =====================
 * Singleton of core variables (getter and setter of browser, bot and config)
 *
 * @contributors: Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
 *
 * @license: This code and contributions have 'MIT License'
 *
 */
class Core {
	constructor() {
		this._browser = null;
		this._bot = null;
		this._config = null;
	}

	set browser(browser) {
		this._browser = browser;
	}
	get browser() {
		return this._browser;
	}
	set bot(bot) {
		this._bot = bot;
	}
	get bot() {
		return this._bot;
	}
	set config(config) {
		this._config = config;
	}
	get config() {
		return this._config;
	}
}

module.exports = new Core();