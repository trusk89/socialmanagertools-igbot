const LOG = require('../modules/logger/types');
const LOG_NAME = 'like';
const lOG_MODE = 'likemode';

const Manager_state = require('../modules/base/state').Manager_state;
const STATE = require('../modules/base/state').STATE;
const STATE_EVENTS = require('../modules/base/state').EVENTS;

/**
 * MODE: likemode_realistic
 * =====================
 * Select random hashtag from config list, like fast 10-12 photo and sleep 15-20min. Sleep at night | 400-600 like/day.
 *
 * @author:     Patryk Rzucidlo [@ptkdev] <support@ptkdev.io> (https://ptkdev.it)
 * @license:    This code and contributions have 'GNU General Public License v3'
 * @version:    0.1
 * @changelog:  0.1 initial release
 * 
 */
class Likemode_realistic extends Manager_state{
    constructor(bot, config, utils) {
        super();
        this.bot = bot;
        this.config = config;
        this.utils = utils;

        this.cache_hash_tags = [];
    }

    /**
     * Get photo url from cache
     * @return {string} url
     */
    getPhotoUrl(){
        let photo_url = "";
        do {
            photo_url = this.cache_hash_tags.pop();
        } while ((typeof photo_url === "undefined" || photo_url.indexOf("tagged") === -1) && this.cache_hash_tags.length > 0);
        return photo_url;
    }

    /**
     * likemode_realistic: Open Hashtag
     * =====================
     * Get random hashtag from array and open page
     *
     */
    async like_open_hashtagpage() {
        let hashtag_tag = this.utils.get_random_hash_tag();
        this.utils.logger(LOG.INFO, LOG_NAME, "current hashtag " + hashtag_tag);
        try {
            await this.bot.goto('https://www.instagram.com/explore/tags/' + hashtag_tag + '/');
        } catch (err) {
            this.utils.logger(LOG.ERROR, LOG_NAME, "goto " + err);
        }

        this.utils.sleep(this.utils.random_interval(4, 8));

        await this.utils.screenshot(LOG_NAME, "last_hashtag");
    }

    /**
     * likemode_realistic: Open Photo
     * =====================
     * Open url of photo and cache urls from hashtag page in array
     *
     */
    async like_get_urlpic() {
        this.utils.logger(LOG.INFO, LOG_NAME, "like_get_urlpic");

        let photo_url = "";

        if (this.cache_hash_tags.length <= 0) {
            try {
                this.cache_hash_tags = await this.bot.$$eval('article a', hrefs => hrefs.map((a) => {
                    return a.href;
                }));

                this.utils.sleep(this.utils.random_interval(10, 15));

                if (this.utils.isDebug())
                    this.utils.logger(LOG.DEBUG, LOG_NAME, "array photos " + this.cache_hash_tags);

                photo_url = this.getPhotoUrl();

                this.utils.logger(LOG.INFO, LOG_NAME, "current photo url " + photo_url);
                if (typeof photo_url === "undefined")
                    this.utils.logger(LOG.WARNING, LOG_NAME, "check if current hashtag have photos, you write it good in config.js? Bot go to next hashtag.");

                this.utils.sleep(this.utils.random_interval(4, 8));

                await this.bot.goto(photo_url);
            } catch (err) {
                this.cache_hash_tags = [];
                this.utils.logger(LOG.ERROR, LOG_NAME, "like_get_urlpic error" + err);
                await this.utils.screenshot(LOG_NAME, "like_get_urlpic_error");
            }
        } else {
            photo_url = this.getPhotoUrl();

            this.utils.logger(LOG.INFO, LOG_NAME, "current photo url from cache " + photo_url);
            this.utils.sleep(this.utils.random_interval(4, 8));

            try {
                await this.bot.goto(photo_url);
            } catch (err) {
                this.utils.logger(LOG.ERROR, LOG_NAME, "goto " + err);
            }
        }

        this.utils.sleep(this.utils.random_interval(4, 8));
    }

    /**
     * likemode_realistic: Love me
     * =====================
     * Click on heart and verify if instagram not (soft) ban you
     *
     */
    async like_click_heart() {
        this.utils.logger(LOG.INFO, LOG_NAME, "try heart like");

        let heart = "";

        try {
            heart = await this.bot.$('.coreSpriteHeartOpen');
            if (heart !== null) {
                this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.OK);
            } else {
                this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.ERROR);
            }

            if (this.isOk()) {
                await this.bot.waitForSelector('main article:nth-child(1) section:nth-child(1) a:nth-child(1)');
                let button = await this.bot.$('main article:nth-child(1) section:nth-child(1) a:nth-child(1)');
                await button.click();
            } else {
                this.utils.logger(LOG.INFO, LOG_NAME, "bot like this photo in before loop, use hashtag with more new photos");
                this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.ERROR);
            }
        } catch (err) {
            if (this.utils.isDebug())
                this.utils.logger(LOG.DEBUG, LOG_NAME, err);
            this.utils.logger(LOG.INFO, LOG_NAME, "bot like this photo in before loop, use hashtag with more new photos");
            this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.ERROR);
        }

        this.utils.sleep(this.utils.random_interval(4, 8));

        this.bot.reload();

        this.utils.sleep(this.utils.random_interval(4, 8));

        await this.utils.screenshot(LOG_NAME, "last_like");

        this.utils.sleep(this.utils.random_interval(4, 8));

        if (this.isOk()) {
            try {
                heart = await this.bot.$('.coreSpriteHeartOpen');

                if (heart === null) {
                    this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.OK);
                } else {
                    this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.ERROR);
                }

                if (this.isError()) {
                    this.utils.logger(LOG.WARNING, LOG_NAME, "</3");
                    this.utils.logger(LOG.WARNING, LOG_NAME, "error bot :( not like photo, now bot sleep 5-10min");
                    this.utils.logger(LOG.WARNING, LOG_NAME, "You are in possible soft ban... If this message appear all time stop bot for 24h...");
                    this.utils.sleep(this.utils.random_interval(60 * 5, 60 * 10));
                } else if (this.isOk()) {
                    this.utils.logger(LOG.INFO, LOG_NAME, "<3");
                }
            } catch (err) {
                if (this.utils.isDebug())
                    this.utils.logger(LOG.DEBUG, LOG_NAME, err);
                this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.ERROR);
            }
        } else {
            this.utils.logger(LOG.WARNING, LOG_NAME, "</3");
            this.utils.logger(LOG.WARNING, LOG_NAME, "You like this previously, change hashtag ig have few photos");
            this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.READY);
        }

        this.utils.sleep(this.utils.random_interval(2, 5));
        await this.utils.screenshot(LOG_NAME, "last_like_after");
    }

    /**
     * LikemodeClassic Flow
     * =====================
     *
     */
    async start() {
        this.utils.logger(LOG.INFO, lOG_MODE, "realistic");

        let today = "";

        do {
            today = new Date();
            this.utils.logger(LOG.INFO, lOG_MODE, "time night: " + (parseInt(today.getHours() + "" + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes())));
            if (parseInt(today.getHours() + "" + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes()) >= (this.config.bot_sleep_night).replace(":", "")) {

                this.utils.logger(LOG.INFO, lOG_MODE, "loading... " + new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds()));
                this.utils.logger(LOG.INFO, lOG_MODE, "cache array size " + this.cache_hash_tags.length);

                if (this.cache_hash_tags.length <= 0)
                    await this.like_open_hashtagpage();

                this.utils.sleep(this.utils.random_interval(4, 8));

                await this.like_get_urlpic();

                this.utils.sleep(this.utils.random_interval(4, 8));

                await this.like_click_heart();

                if (this.cache_hash_tags.length < 9 || this.isReady()) //remove popular photos
                    this.cache_hash_tags = [];

                if (this.cache_hash_tags.length <= 0 && this.isNotReady()) {
                    this.utils.logger(LOG.INFO, lOG_MODE, "finish fast like, bot sleep " + this.config.bot_fastlike_min + "-" + this.config.bot_fastlike_max + " minutes");
                    this.cache_hash_tags = [];
                    this.utils.sleep(this.utils.random_interval(60 * this.config.bot_fastlike_min, 60 * this.config.bot_fastlike_max));
                }
            } else {
                this.utils.logger(LOG.INFO, lOG_MODE, "is night, bot sleep");
                this.utils.sleep(this.utils.random_interval(60 * 4, 60 * 5));
            }
        } while (true);
    }

}

module.exports = (bot, config, utils) => { return new Likemode_realistic(bot, config, utils); };