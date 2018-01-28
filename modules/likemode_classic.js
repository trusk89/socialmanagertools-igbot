/**
 * MODE: likemode_classic
 * =====================
 * Select random hashtag from config list and like 1 random photo (of last 20) | 750-900 like/day.
 *
 * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
 * @license:    This code and contributions have 'GNU General Public License v3'
 * @version:    0.5
 * @changelog:  0.1 initial release
 *              0.2 new pattern
 *
 */
class Likemode_classic {
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
     * likemode_classic: Open Hashtag
     * =====================
     * Get random hashtag from array and open page
     *
     * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
     * @license:    This code and contributions have 'GNU General Public License v3'
     * @version:    0.1
     * @changelog:  0.1 initial release
     *
     */
    async like_open_hashtagpage() {
        let hashtag_tag = this.config.instagram_hashtag[Math.floor(Math.random() * this.config.instagram_hashtag.length)];
        this.utils.logger("[INFO]", "like", "current hashtag " + hashtag_tag);

        await this.bot.goto('https://www.instagram.com/explore/tags/' + hashtag_tag + '/');

        this.utils.sleep(this.utils.random_interval(4, 8));

        await this.utils.screenshot("like", "last_hashtag");
    }

    /**
     * likemode_classic: Open Photo
     * =====================
     * Open url of photo
     *
     * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
     * @license:    This code and contributions have 'GNU General Public License v3'
     * @version:    0.1
     * @changelog:  0.1 initial release
     *
     */
    async like_get_urlpic(cache_hashtag) {
        this.utils.logger("[INFO]", "like", "like_get_urlpic");

        let photo_url = "";

        if (cache_hashtag.length < 9) //remove popular photos
            cache_hashtag = [];

        if (cache_hashtag.length <= 0) {
            try {
                cache_hashtag = await this.bot.$$eval('article a', hrefs => hrefs.map((a) => {
                    return a.href;
                }));

                this.utils.sleep(this.utils.random_interval(10, 15));

                if (this.config.debug == true)
                    this.utils.logger("[DEBUG]", "like", "array photos " + cache_hashtag);
                do {
                    photo_url = cache_hashtag.pop();
                } while ((typeof photo_url === "undefined" || photo_url.indexOf("tagged") === -1) && cache_hashtag.length > 0);

                this.utils.logger("[INFO]", "like", "current photo url " + photo_url);
                this.utils.sleep(this.utils.random_interval(4, 8));

                await this.bot.goto(photo_url);
            } catch (err) {
                cache_hashtag = [];
                this.utils.logger("[ERROR]", "like", "like_get_urlpic error" + err);
                await this.utils.screenshot("like", "like_get_urlpic_error");
            }
        } else {
            do {
                photo_url = cache_hashtag.pop();
            } while ((typeof photo_url === "undefined" || photo_url.indexOf("tagged") === -1) && cache_hashtag.length > 0);

            this.utils.logger("[INFO]", "like", "current photo url from cache " + photo_url);
            this.utils.sleep(this.utils.random_interval(4, 8));

            await this.bot.goto(photo_url);
        }

        this.utils.sleep(this.utils.random_interval(4, 8));

        return cache_hashtag;
    }

    /**
     * likemode_classic: Love me
     * =====================
     * Click on heart
     *
     * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
     * @license:    This code and contributions have 'GNU General Public License v3'
     * @version:    0.1
     * @changelog:  0.1 initial release
     *
     */
    async like_click_heart() {
        this.utils.logger("[INFO]", "like", "try heart like");

        let status = "";
        let heart = "",
            html_text = "";

        try {
            heart = await this.bot.$('.coreSpriteHeartOpen');
            if (heart != null) {
                this.status.CURRENT = this.status.OK;
                await heart.dispose();
            } else {
                this.status.CURRENT = this.status.ERROR;
            }

            if (this.status.CURRENT == this.status.OK) {
                await this.bot.waitForSelector('main article:nth-child(1) section:nth-child(1) a:nth-child(1)');
                let button = await this.bot.$('main article:nth-child(1) section:nth-child(1) a:nth-child(1)');
                await button.click();
            } else {
                this.utils.logger("[INFO]", "like", "bot like this photo in before loop, use hashtag with more new photos");
                this.status.CURRENT = this.status.ERROR;
            }
        } catch (err) {
            if (this.config.debug == true)
                this.utils.logger("[DEBUG]", "like", err);
            this.utils.logger("[INFO]", "like", "bot like this photo in before loop, use hashtag with more new photos");
            this.status.CURRENT = this.status.ERROR;
        }

        this.utils.sleep(this.utils.random_interval(4, 8));

        this.bot.reload();

        this.utils.sleep(this.utils.random_interval(4, 8));

        await this.utils.screenshot("like", "last_like");

        this.utils.sleep(this.utils.random_interval(4, 8));

        if (this.status.CURRENT == this.status.OK) {
            try {
                heart = await this.bot.$('.coreSpriteHeartOpen');

                if (heart == null) {
                    this.status.CURRENT = this.status.OK;
                } else {
                    this.status.CURRENT = this.status.ERROR;
                }

                if (this.status.CURRENT == this.status.ERROR) {
                    this.utils.logger("[WARNING]", "like", "</3");
                    this.utils.logger("[WARNING]", "like", "error bot :( not like photo, go to next");
                    this.utils.logger("[WARNING]", "like", "You are in possible soft ban... If this message appear all time stop bot for 24h...");
                } else if (this.status.CURRENT == this.status.OK) {
                    this.utils.logger("[INFO]", "like", "<3");
                }
            } catch (err) {
                if (this.config.debug == true)
                    this.utils.logger("[DEBUG]", "like", err);
                this.status.CURRENT = this.status.ERROR;
            }
        } else {
            this.utils.logger("[WARNING]", "like", "</3");
            this.utils.logger("[WARNING]", "like", "You like this previously, change hashtag ig have few photos");
        }

        this.utils.sleep(this.utils.random_interval(2, 5));

        await this.utils.screenshot("like", "last_like_after");

        return this.status.CURRENT;
    }

    /**
     * LikemodeClassic Flow
     * =====================
     * 
     * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
     * @license:    This code and contributions have 'GNU General Public License v3'
     * @version:    0.1
     * @changelog:  0.1 initial release
     *
     */
    async start() {
        this.utils.logger("[INFO]", "likemode", "classic");

        let today = "";
        let like_status;
        let cache_hashtag = [];
        let t1, t2, sec, sec_min, sec_max;
        sec_min = parseInt(86400 / this.config.bot_likeday_max);
        sec_max = parseInt(86400 / this.config.bot_likeday_min);

        do {
            today = new Date();
            t1 = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds());
            this.utils.logger("[INFO]", "likemode", "loading... " + new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds()));
            this.utils.logger("[INFO]", "likemode", "cache array size " + cache_hashtag.length);
            if (cache_hashtag.length <= 0)
                await this.like_open_hashtagpage();

            this.utils.sleep(this.utils.random_interval(4, 8));

            cache_hashtag = await this.like_get_urlpic(cache_hashtag);
            this.utils.sleep(this.utils.random_interval(4, 8));

            like_status = await this.like_click_heart();


            today = new Date();
            t2 = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds());
            sec = Math.abs((t1.getTime() - t2.getTime()) / 1000);
            if (sec < sec_min && like_status >= 1) {
                this.utils.logger("[INFO]", "likemode", "seconds of loop " + sec + "... for miss ban bot wait " + (sec_min - sec) + "-" + (sec_max - sec));
                this.utils.sleep(this.utils.random_interval(sec_min - sec, sec_max - sec));
            } else {
                cache_hashtag = [];
            }
        } while (true);
    }

}

module.exports = (bot, config, utils) => { return new Likemode_classic(bot, config, utils); };