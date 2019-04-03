/**
 * API: analytics
 * =====================
 * Get stats of like, follow defollow, etc...
 *
 * @author:  Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
 * @license: This code and contributions have 'MIT License'
 *
 */
const Log = require("./../logger/log");
const Translate = require("./../commons/translate");
const Utils = require("./../commons/utils");
const core = require("./../core/core");

class Analytics {
	constructor (LOG_NAME = "api") {
		this.core = core;
		this.LOG_NAME = LOG_NAME;

		this.log = new Log(this.LOG_NAME);
		this.lang = new Translate();
		this.utils = new Utils();
	}
}

module.exports = Analytics;