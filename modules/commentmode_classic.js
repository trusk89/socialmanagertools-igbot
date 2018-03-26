const LOG = require('../modules/logger/types');

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
class CommentMode_classic{
    constructor(bot, config, utils) {
        this.bot = bot;
        this.config = config;
        this.utils = utils;
        this.status = {
            OK: 1,
            ERROR: 0,
            CURRENT: null,
        };
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
    async like_open_hashtagpage() {
        let hashtag_tag = this.config.instagram_hashtag[Math.floor(Math.random() * this.config.instagram_hashtag.length)];
        this.utils.logger(LOG.INFO, "comment", "current hashtag " + hashtag_tag);
        try {
            await this.bot.goto('https://www.instagram.com/explore/tags/' + hashtag_tag + '/');
        } catch (err) {
            this.utils.logger(LOG.ERROR, "comment", "goto " + err);
        }

        this.utils.sleep(this.utils.random_interval(4, 8));

        await this.utils.screenshot("comment", "last_hashtag");
    }

    /**
     * commentmode_classic: Open Photo
     * =====================
     * Open url of photo and cache urls from hashtag page in array
     *
     */
    async like_get_urlpic(cache_hashtag) {
        this.utils.logger(LOG.INFO, "comment", "like_get_urlpic");

        let photo_url = "";

        if (cache_hashtag.length <= 0) {
            try {
                cache_hashtag = await this.bot.$$eval('article a', hrefs => hrefs.map((a) => {
                    return a.href;
                }));

                this.utils.sleep(this.utils.random_interval(10, 15));

                if (this.config.debug == true)
                    this.utils.logger(LOG.DEBUG, "comment", "array photos " + cache_hashtag);
                do {
                    photo_url = cache_hashtag.pop();
                } while ((typeof photo_url === "undefined" || photo_url.indexOf("tagged") === -1) && cache_hashtag.length > 0);

                this.utils.logger(LOG.INFO, "comment", "current photo url " + photo_url);
                if (typeof photo_url === "undefined")
                    this.utils.logger(LOG.WARNING, "comment", "check if current hashtag have photos, you write it good in config.js? Bot go to next hashtag.");

                this.utils.sleep(this.utils.random_interval(4, 8));

                await this.bot.goto(photo_url);
            } catch (err) {
                cache_hashtag = [];
                this.utils.logger(LOG.ERROR, "comment", "like_get_urlpic error" + err);
                await this.utils.screenshot("comment", "like_get_urlpic_error");
            }
        } else {
            do {
                photo_url = cache_hashtag.pop();
            } while ((typeof photo_url === "undefined" || photo_url.indexOf("tagged") === -1) && cache_hashtag.length > 0);

            this.utils.logger(LOG.INFO, "comment", "current photo url from cache " + photo_url);

            this.utils.sleep(this.utils.random_interval(4, 8));

            try {
                await this.bot.goto(photo_url);
            } catch (err) {
                this.utils.logger(LOG.ERROR, "comment", "goto " + err);
            }
        }

        this.utils.sleep(this.utils.random_interval(4, 8));

        return cache_hashtag;
    }

    /**
     * commentmode_classic: Love me
     * =====================
     * leave a comment under the photo
     *
     */
    async comment() {
        this.utils.logger(LOG.INFO, "comment", "try leave comment");

        let texterea = "";
        let commentAreaElem = 'main article:nth-child(1) section:nth-child(5) form textarea';
        let nickUnderPhoto = `main article:nth-child(1) div:nth-child(3) div:nth-child(3) ul li a[title="${this.config.instagram_username}"]`;
        try {
            texterea = await this.bot.$(commentAreaElem);
            if (texterea != null) {
                this.status.CURRENT = this.status.OK;
            } else {
                this.status.CURRENT = this.status.ERROR;
            }

            if (this.status.CURRENT === this.status.OK) {
                await this.bot.waitForSelector(commentAreaElem);
                let button = await this.bot.$(commentAreaElem);
                await button.click();
                await this.bot.type(commentAreaElem, this.getRandomComment(), { delay: 100 });
                await button.press('Enter');
            } else {
                this.utils.logger(LOG.INFO, "comment", "bot is unable to comment on this photo");
                this.status.CURRENT = this.status.ERROR;
            }
        } catch (err) {
            if (this.config.debug === true)
                this.utils.logger(LOG.DEBUG, "comment", err);
            this.utils.logger(LOG.INFO, "comment", "bot is unable to comment on this photo");
            this.status.CURRENT = this.status.ERROR;
        }

        this.utils.sleep(this.utils.random_interval(4, 8));

        this.bot.reload();

        this.utils.sleep(this.utils.random_interval(4, 8));

        await this.utils.screenshot("comment", "last_comment");

        this.utils.sleep(this.utils.random_interval(4, 8));

        if (this.status.CURRENT === this.status.OK) {
            try {
                texterea = await this.bot.$(nickUnderPhoto);

                if (texterea == null) {
                    this.status.CURRENT = this.status.OK;
                } else {
                    this.status.CURRENT = this.status.ERROR;
                }

                if (this.status.CURRENT == this.status.ERROR) {
                    this.utils.logger(LOG.WARNING, "comment", "</3");
                    this.utils.logger(LOG.WARNING, "comment", "error bot :( not comment under photo, now bot sleep 5-10min");
                    this.utils.logger(LOG.WARNING, "comment", "You are in possible soft ban... If this message appear all time stop bot for 24h...");
                    this.utils.sleep(this.utils.random_interval(60 * 5, 60 * 10));
                } else if (this.status.CURRENT == this.status.OK) {
                    this.utils.logger(LOG.INFO, "comment", "<3");
                }
            } catch (err) {
                if (this.config.debug == true)
                    this.utils.logger(LOG.DEBUG, "comment", err);
                this.status.CURRENT = this.status.ERROR;
            }
        } else {
            this.utils.logger(LOG.WARNING, "comment", "</3");
            this.utils.logger(LOG.WARNING, "comment", "You like this previously, change hashtag ig have few photos");
            this.status.CURRENT = 3;
        }

        this.utils.sleep(this.utils.random_interval(2, 5));

        await this.utils.screenshot("comment", "last_comment_after");

        return this.status.CURRENT;
    }

    /**
     * CommentModeClassic Flow
     * =====================
     *
     */
    async start() {
        this.utils.logger(LOG.INFO, "commentmode", "classic");

        let today = "";
        let like_status;
        let cache_hashtag = [];
        let t1, t2, sec, sec_min, sec_max;
        sec_min = parseInt(86400 / this.config.bot_likeday_max);
        sec_max = parseInt(86400 / this.config.bot_likeday_min);

        do {
            today = new Date();
            let hour = parseInt(today.getHours() + "" + (today.getMinutes() < 10 ? '0' : ''));
            let minutes = today.getMinutes();

            this.utils.logger(LOG.INFO, "comment_mode", `time night: ${hour}:${minutes}`);

            if (parseInt(hour + minutes) >= (this.config.bot_sleep_night).replace(":", "")) {
                t1 = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds());
                this.utils.logger(LOG.INFO, "comment_mode", "loading... " + new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds()));
                this.utils.logger(LOG.INFO, "comment_mode", "cache array size " + cache_hashtag.length);
                if (cache_hashtag.length <= 0)
                    await this.like_open_hashtagpage();

                this.utils.sleep(this.utils.random_interval(4, 8));

                cache_hashtag = await this.like_get_urlpic(cache_hashtag);

                this.utils.sleep(this.utils.random_interval(4, 8));

                like_status = await this.comment();

                if (cache_hashtag.length < 9 || like_status == 3) //remove popular photos
                    cache_hashtag = [];

                if (cache_hashtag.length <= 0 && like_status != 3) {
                    this.utils.logger(LOG.INFO, "comment_mode", "finish fast comment, bot sleep " + this.config.bot_fastlike_min + "-" + this.config.bot_fastlike_max + " minutes");
                    cache_hashtag = [];
                    this.utils.sleep(this.utils.random_interval(60 * this.config.bot_fastlike_min, 60 * this.config.bot_fastlike_max));
                }
            } else {
                this.utils.logger(LOG.INFO, "comment_mode", "is night, bot sleep");
                this.utils.sleep(this.utils.random_interval(60 * 4, 60 * 5));
            }
        } while (true);
    }
}

module.exports = (bot, config, utils) => { return new CommentMode_classic(bot, config, utils); };