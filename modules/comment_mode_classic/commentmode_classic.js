// Export
const LOG_NAME = "comment";

const Manager_state = require("../base/state").Manager_state;
const STATE = require("../base/state").STATE;
const STATE_EVENTS = require("../base/state").EVENTS;

// log
const Log = require("./../logger/Log");

/**
 * MODE: commentmode_classic
 * =====================
 *
 * @author:     Ilua Chubarov [@agoalofalife] <agoalofalife@gmail.com>
 * @license:    This code and contributions have 'GNU General Public License v3'
 * @version:    0.1
 * @changelog:  0.1 initial release
 *
 */
class commentmode_classic extends Manager_state {
    constructor(bot, config, utils) {
        super();

        this.bot = bot;
        this.config = config;
        this.utils = utils;

        this.cache_hash_tags = [];
        this.log = new Log(LOG_NAME);
    }

    /**
     * Get random comment from config file
     * @return string
     */
    get_comment() {
        this.log.info(`type source comments is ${this.config.comment_mode.comments.type}`);
        switch (this.config.comment_mode.comments.type) {
        case "array":
            return require("./comment_sources/array")().get_random_comment();
        default:
            this.log.error("source comments not found");
            return "";
        }
    }

    /**
     * Get photo url from cache
     * @return {string} url
     */
    get_photo_url() {
        let photo_url = "";
        do {
            photo_url = this.cache_hash_tags.pop();
        } while ((typeof photo_url === "undefined" || photo_url.indexOf("tagged") === -1) && this.cache_hash_tags.length > 0);
        return photo_url;
    }

    /**
     * commentmode_classic: Open Hashtag
     * =====================
     * Get random hashtag from array and open page
     *
     */
    async open_page() {
        let hashtag = this.utils.get_random_hash_tag();
        this.log.info(`current hashtag ${hashtag}`);

        try {
            await this.bot.goto("https://www.instagram.com/explore/tags/" + hashtag + "/");
        } catch (err) {
            this.log.error(`goto ${err}`);
        }

        this.utils.sleep(this.utils.random_interval(4, 8));

        await this.utils.screenshot(LOG_NAME, "last_hashtag");
    }

    /**
     * commentmode_classic: Open Photo
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

            this.log.info(`current photo url from cache ${photo_url}`);
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
     * Check exist element under photo
     * @return {Promise<void>}
     */
    async check_leave_comment() {
        let nick_under_photo = `main article:nth-child(1) div:nth-child(3) div:nth-child(3) ul li a[title="${this.config.instagram_username}"]`;
        if (this.is_ok()) {
            try {
                let nick = await this.bot.$(nick_under_photo);

                if (nick !== null) {
                    this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.OK);
                } else {
                    this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.ERROR);
                }

                if (this.is_error()) {
                    this.log.warning("</3");
                    this.log.warning("error bot :( not comment under photo, now bot sleep 5-10min");
                    this.log.warning("You are in possible soft ban... If this message appear all time stop bot for 24h...");
                    this.utils.sleep(this.utils.random_interval(60 * 5, 60 * 10));
                } else if (this.is_ok()) {
                    this.log.info("</3");
                }
            } catch (err) {
                if (this.utils.is_debug())
                    this.log.debug(err);
                this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.ERROR);
            }
        } else {
            this.log.warning("</3");
            this.log.warning("You like this previously, change hashtag ig have few photos");
            this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.READY);
        }
    }

    /**
     * commentmode_classic: Love me
     * =====================
     * leave a comment under the photo
     *
     */
    async comment() {
        this.log.info("try leave comment");
        let comment_area_elem = "main article:nth-child(1) section:nth-child(5) form textarea";

        try {
            let textarea = await this.bot.$(comment_area_elem);
            if (textarea !== null) {
                this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.OK);
            } else {
                this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.ERROR);
            }

            if (this.is_ok()) {
                await this.bot.waitForSelector(comment_area_elem);
                let button = await this.bot.$(comment_area_elem);
                await button.click();
                await this.bot.type(comment_area_elem, this.get_comment(), { delay: 100 });
                await button.press("Enter");
            } else {
                this.log.info("bot is unable to comment on this photo");
                this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.ERROR);
            }
        } catch (err) {
            if (this.utils.is_debug())
                this.log.debug(err);
            this.log.info("bot is unable to comment on this photo");
            this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.ERROR);
        }

        this.utils.sleep(this.utils.random_interval(4, 8));

        this.bot.reload();

        this.utils.sleep(this.utils.random_interval(4, 8));

        await this.utils.screenshot(LOG_NAME, "last_comment");

        this.utils.sleep(this.utils.random_interval(4, 8));
        await this.check_leave_comment();

        this.utils.sleep(this.utils.random_interval(2, 5));
        await this.utils.screenshot(LOG_NAME, "last_comment_after");
    }

    /**
     * CommentModeClassic Flow
     * =====================
     *
     */
    async start() {
        this.log.info("classic");

        do {
            let today = new Date();
            let hour = today.getHours() + "" + (today.getMinutes() < 10 ? "0" : "");
            let minutes = today.getMinutes();

            this.log.info(`time night: ${hour}:${minutes}`);

            if (parseInt(hour + minutes) >= (this.config.bot_sleep_night).replace(":", "")) {
                this.log.info("loading... " + new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds()));
                this.log.info(`cache array size ${this.cache_hash_tags.length}`);

                if (this.cache_hash_tags.length <= 0)
                    await this.open_page();

                this.utils.sleep(this.utils.random_interval(4, 8));

                await this.like_get_urlpic();

                this.utils.sleep(this.utils.random_interval(4, 8));

                await this.comment();

                if (this.cache_hash_tags.length < 9 || this.is_ready()) //remove popular photos
                    this.cache_hash_tags = [];

                if (this.cache_hash_tags.length <= 0 && this.is_not_ready()) {
                    this.log.info(`finish fast comment, bot sleep ${this.config.bot_fastlike_min} - ${this.config.bot_fastlike_max} minutes`);
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

module.exports = (bot, config, utils) => { return new commentmode_classic(bot, config, utils); };