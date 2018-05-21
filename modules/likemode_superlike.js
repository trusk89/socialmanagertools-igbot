//Export
const LOG_NAME = "like";
const Manager_state = require("../modules/base/state").Manager_state;

// log
const Log = require("./logger/Log");

/**
 * MODE: likemode_superlike
 * =====================
 * Select random hashtag from config list and like 3 random photo of same user | 750-900 like/day.
 *
 * @author:     Patryk Rzucidlo [@ptkdev] <support@ptkdev.io> (https://ptkdev.it)
 * @license:    This code and contributions have 'GNU General Public License v3'
 * @version:    0.1
 * @changelog:  0.1 initial release
 *
 */
class Likemode_superlike extends Manager_state{
    constructor(bot, config, utils) {
        super();
        this.bot = bot;
        this.config = config;
        this.utils  = utils;

        this.cache_hash_tags = [];
        this.log = new Log(LOG_NAME);
    }

}

module.exports = (bot, config, utils) => { return new Likemode_superlike(bot, config, utils); };