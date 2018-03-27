// Export
const LOG = require('../modules/logger/types');
const LOG_NAME = 'comment';
const LOG_MODE = 'comment_mode';
const ManagerState = require('../modules/base/state').ManagerState;
const STATE = require('../modules/base/state').STATE;
const STATE_EVENTS = require('../modules/base/state').EVENTS;

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
class CommentMode_classic extends ManagerState{
    constructor(bot, config, utils) {
        super();

        this.bot = bot;
        this.config = config;
        this.utils = utils;

        this.cacheHashTags = [];
    }

    /**
     * Get random comment from config file
     * @return string
     */
    getRandomComment(){
        let comments = this.config.comment_mode.comments;
         return comments[Math.floor(Math.random()*comments.length)];
    }

    /**
     * commentmode_classic: Open Hashtag
     * =====================
     * Get random hashtag from array and open page
     *
     */
    async openPage() {
        let hashTag = this.utils.getRandomHashTag();
        this.utils.logger(LOG.INFO, LOG_NAME, "current hashtag " + hashTag);

        try {
            await this.bot.goto('https://www.instagram.com/explore/tags/' + hashTag + '/');
        } catch (err) {
            this.utils.logger(LOG.ERROR, LOG_NAME, "goto " + err);
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
        this.utils.logger(LOG.INFO, LOG_NAME, "like_get_urlpic");

        let photo_url = "";

        if (this.cacheHashTags.length <= 0) {
            try {
                this.cacheHashTags = await this.bot.$$eval('article a', hrefs => hrefs.map((a) => {
                    return a.href;
                }));

                this.utils.sleep(this.utils.random_interval(10, 15));

                if (this.utils.isDebug())
                    this.utils.logger(LOG.DEBUG, LOG_NAME, "array photos " + this.cacheHashTags);

                do {
                    photo_url = this.cacheHashTags.pop();
                } while ((typeof photo_url === "undefined" || photo_url.indexOf("tagged") === -1) && this.cacheHashTags.length > 0);

                this.utils.logger(LOG.INFO, LOG_NAME, "current photo url " + photo_url);
                if (typeof photo_url === "undefined")
                    this.utils.logger(LOG.WARNING, LOG_NAME, "check if current hashtag have photos, you write it good in config.js? Bot go to next hashtag.");

                this.utils.sleep(this.utils.random_interval(4, 8));

                await this.bot.goto(photo_url);
            } catch (err) {
                this.cacheHashTags = [];
                this.utils.logger(LOG.ERROR, LOG_NAME, "like_get_urlpic error" + err);
                await this.utils.screenshot(LOG_NAME, "like_get_urlpic_error");
            }
        } else {
            do {
                photo_url = this.cacheHashTags.pop();
            } while ((typeof photo_url === "undefined" || photo_url.indexOf("tagged") === -1) && this.cacheHashTags.length > 0);

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
     * Check exist element under photo
     * @return {Promise<void>}
     */
    async checkLeaveComment(){
        let nickUnderPhoto = `main article:nth-child(1) div:nth-child(3) div:nth-child(3) ul li a[title="${this.config.instagram_username}"]`;
        if (this.isOk()) {
            try {
                let nick = await this.bot.$(nickUnderPhoto);

                if (nick !== null) {
                    this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.OK);
                } else {
                    this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.ERROR);
                }

                if (this.isError()) {
                    this.utils.logger(LOG.WARNING, LOG_NAME, "</3");
                    this.utils.logger(LOG.WARNING, LOG_NAME, "error bot :( not comment under photo, now bot sleep 5-10min");
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
    }

    /**
     * commentmode_classic: Love me
     * =====================
     * leave a comment under the photo
     *
     */
    async comment() {
        this.utils.logger(LOG.INFO, LOG_NAME, "try leave comment");

        let textarea = '';
        let commentAreaElem = 'main article:nth-child(1) section:nth-child(5) form textarea';

        try {
            textarea = await this.bot.$(commentAreaElem);
            if (textarea !== null) {
                this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.OK);
            } else {
                this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.ERROR);
            }

            if (this.isOk()) {
                await this.bot.waitForSelector(commentAreaElem);
                let button = await this.bot.$(commentAreaElem);
                await button.click();
                await this.bot.type(commentAreaElem, this.getRandomComment(), { delay: 100 });
                await button.press('Enter');
            } else {
                this.utils.logger(LOG.INFO, LOG_NAME, "bot is unable to comment on this photo");
                this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.ERROR);
            }
        } catch (err) {
            if (this.utils.isDebug())
                this.utils.logger(LOG.DEBUG, LOG_NAME, err);
            this.utils.logger(LOG.INFO, LOG_NAME, "bot is unable to comment on this photo");
            this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.ERROR);
        }

        this.utils.sleep(this.utils.random_interval(4, 8));

        this.bot.reload();

        this.utils.sleep(this.utils.random_interval(4, 8));

        await this.utils.screenshot(LOG_NAME, "last_comment");

        this.utils.sleep(this.utils.random_interval(4, 8));
        await this.checkLeaveComment();

        this.utils.sleep(this.utils.random_interval(2, 5));
        await this.utils.screenshot(LOG_NAME, "last_comment_after");
    }

    /**
     * CommentModeClassic Flow
     * =====================
     *
     */
    async start() {
        this.utils.logger(LOG.INFO, LOG_MODE, "classic");

        let today = "";

        do {
            today = new Date();
            let hour = today.getHours() + "" + (today.getMinutes() < 10 ? '0' : '');
            let minutes = today.getMinutes();

            this.utils.logger(LOG.INFO, LOG_MODE, `time night: ${hour}:${minutes}`);

            if (parseInt(hour + minutes) >= (this.config.bot_sleep_night).replace(":", "")) {
                this.utils.logger(LOG.INFO, LOG_MODE, "loading... " + new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds()));
                this.utils.logger(LOG.INFO, LOG_MODE, "cache array size " + this.cacheHashTags.length);

                if (this.cacheHashTags.length <= 0)
                    await this.openPage();

                this.utils.sleep(this.utils.random_interval(4, 8));

                await this.like_get_urlpic();

                this.utils.sleep(this.utils.random_interval(4, 8));

                await this.comment();

                if (this.cacheHashTags.length < 9 || this.isReady()) //remove popular photos
                    this.cacheHashTags = [];

                if (this.cacheHashTags.length <= 0 && this.isReady()) {
                    this.utils.logger(LOG.INFO, LOG_MODE, "finish fast comment, bot sleep " + this.config.bot_fastlike_min + "-" + this.config.bot_fastlike_max + " minutes");
                    this.cacheHashTags = [];
                    this.utils.sleep(this.utils.random_interval(60 * this.config.bot_fastlike_min, 60 * this.config.bot_fastlike_max));
                }
            } else {
                this.utils.logger(LOG.INFO, LOG_MODE, "is night, bot sleep");
                this.utils.sleep(this.utils.random_interval(60 * 4, 60 * 5));
            }
        } while (true);
    }
}

module.exports = (bot, config, utils) => { return new CommentMode_classic(bot, config, utils); };