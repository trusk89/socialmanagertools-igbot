const LOG_NAME = "like";

const Manager_state = require("../modules/base/state").Manager_state;
const STATE = require("../modules/base/state").STATE;
const STATE_EVENTS = require("../modules/base/state").EVENTS;

// log
const Log = require("./logger/Log");

/**
 * MODE: fdfmode_classic
 * =====================
 * Defollow all your following (not defollow users in whitelist) | 90 defollow/hour.
 *
 * @author:     Patryk Rzucidlo [@ptkdev] <support@ptkdev.io> (https://ptkdev.it)
 * @license:    This code and contributions have 'GNU General Public License v3'
 * @version:    0.1
 * @changelog:  0.1 initial release
 *
 */
class Fdfmode_classic extends Manager_state{
    constructor(bot, config, utils) {
        super();
        this.bot = bot;
        this.config = config;
        this.utils = utils;

        this.cache_hash_tags = [];
        this.log = new Log(LOG_NAME);
    }

    /**
     * Get photo url from cache
     * @return {string} url
     */
    get_photo_url(){
        let photo_url = "";
        do {
            photo_url = this.cache_hash_tags.pop();
        } while ((typeof photo_url === "undefined" || photo_url.indexOf("tagged") === -1) && this.cache_hash_tags.length > 0);
        return photo_url;
    }

    /**
     * fdfmode_classic: Open Hashtag
     * =====================
     * Get random hashtag from array and open page
     *
     */
    async like_open_hashtagpage() {
        let hashtag_tag = this.utils.get_random_hash_tag();
        this.log.info(`current hashtag ${hashtag_tag}`);
        try {
            await this.bot.goto("https://www.instagram.com/explore/tags/" + hashtag_tag + "/");
        } catch (err) {
            this.log.error(`goto ${err}`);
        }

        this.utils.sleep(this.utils.random_interval(4, 8));

        await this.utils.screenshot(LOG_NAME, "last_hashtag");
    }

    /**
     * fdfmode_classic: Open Photo
     * =====================
     * Open url of photo and cache urls from hashtag page in array
     *
     */
    async like_get_urlpic() {
        this.log.info("like_get_urlpic");

        let photo_url = "";

        if (this.cache_hash_tags.length <= 0) {
            try {
                this.cache_hash_tags = await this.bot.$$eval("article a", hrefs => hrefs.map((a) => {
                    return a.href;
                }));

                this.utils.sleep(this.utils.random_interval(10, 15));

                if (this.utils.is_debug())
                    this.log.debug(`array photos ${this.cache_hash_tags}`);

                photo_url = this.get_photo_url();

                this.log.info(`current photo url ${photo_url}`);
                if (typeof photo_url === "undefined")
                    this.log.warning("check if current hashtag have photos, you write it good in config.js? Bot go to next hashtag.");

                this.utils.sleep(this.utils.random_interval(4, 8));

                await this.bot.goto(photo_url);
            } catch (err) {
                this.cache_hash_tags = [];
                this.log.error(`like_get_urlpic error ${err}`);
                await this.utils.screenshot(LOG_NAME, "like_get_urlpic_error");
            }
        } else {
            photo_url = this.get_photo_url();
            this.log.info(`current photo url from cache  ${photo_url}`);
            this.utils.sleep(this.utils.random_interval(4, 8));

            try {
                await this.bot.goto(photo_url);
            } catch (err) {
                this.log.error(`goto ${err}`);
            }
        }

        this.utils.sleep(this.utils.random_interval(4, 8));
    }

    /**
     * fdfmode_classic: Love me
     * =====================
     * Click on heart and verify if instagram not (soft) ban you
     *
     */
    async like_click_heart() {
        this.log.info("try heart like");

        let selector_heart = "main article:nth-child(1) section:nth-child(1) a:nth-child(1)";
        try {
            await this.bot.waitForSelector(selector_heart);
            let button = await this.bot.$(selector_heart);
            await button.click();
            this.log.info("<3");
        } catch (err) {
            if (this.utils.is_debug())
                this.log.debug(err);

            this.log.info("</3");
            this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.ERROR);
        }

        this.utils.sleep(this.utils.random_interval(4, 8));

        await this.utils.screenshot(LOG_NAME, "last_like_after");
    }

    /**
     * LikemodeClassic Flow
     * =====================
     *
     */
    async start() {
        this.log.info("realistic");

        do {
            let today = new Date();
            this.log.info("time night: " + (parseInt(today.getHours() + "" + (today.getMinutes() < 10 ? "0" : "") + today.getMinutes())));

            if (parseInt(today.getHours() + "" + (today.getMinutes() < 10 ? "0" : "") + today.getMinutes()) >= (this.config.bot_sleep_night).replace(":", "")) {

                this.log.info("loading... " + new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds()));
                this.log.info("cache array size " + this.cache_hash_tags.length);

                if (this.cache_hash_tags.length <= 0)
                    await this.like_open_hashtagpage();

                this.utils.sleep(this.utils.random_interval(4, 8));

                await this.like_get_urlpic();

                this.utils.sleep(this.utils.random_interval(4, 8));

                await this.like_click_heart();

                if (this.cache_hash_tags.length < 9 || this.is_ready()) //remove popular photos
                    this.cache_hash_tags = [];

                if (this.cache_hash_tags.length <= 0 && this.is_not_ready()) {
                    this.log.info("finish fast like, bot sleep " + this.config.bot_fastlike_min + "-" + this.config.bot_fastlike_max + " minutes");
                    this.cache_hash_tags = [];
                    this.utils.sleep(this.utils.random_interval(60 * this.config.bot_fastlike_min, 60 * this.config.bot_fastlike_max));
                }
            } else {
                this.log.info("is night, bot sleep");
                this.utils.sleep(this.utils.random_interval(60 * 4, 60 * 5));
            }
        } while (true);
    }

}

module.exports = (bot, config, utils) => { return new Fdfmode_classic(bot, config, utils); };
