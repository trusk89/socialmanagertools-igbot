/**
 * MODE: likemode_classic
 * =====================
 * Select random hashtag from config list and like 1 random photo (of last 20) | 750-900 like/day.
 *
 * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
 * @license:    This code and contributions have 'GNU General Public License v3'
 * @version:    0.2
 * @changelog:  0.1 initial release
 *              0.2 new pattern
 *
 */
class Likemode_classic {
    constructor(bot, config, utils) {
        this.bot = bot;
        this.config = config;
        this.utils = utils;
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
    like_open_hashtagpage() {
        let hashtag_tag = this.config.instagram_hashtag[Math.floor(Math.random() * this.config.instagram_hashtag.length)];
        this.utils.logger("[INFO]", "like", "current hashtag " + hashtag_tag);
        this.bot.url('https://www.instagram.com/explore/tags/' + hashtag_tag + '/');
        this.utils.sleep(this.utils.random_interval(4, 8));
        this.utils.screenshot(this.bot, "like", "last_hashtag");
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
        let self = this;
        let photo_url = "";
        if (cache_hashtag.length <= 0) {
            this.bot.scroll(0, 10000);
            this.utils.sleep(this.utils.random_interval(10, 15));
            try {
                let cache_hashtag_tmp = await this.bot.getAttribute('article a', 'href');
                cache_hashtag = [];
                if (self.config.debug == true)
                    self.utils.logger("[DEBUG]", "like", "array photos " + cache_hashtag_tmp);
                for (let i = 0; i < cache_hashtag_tmp.length; i++)
                    if (i > 9)
                        cache_hashtag.push(cache_hashtag_tmp[i]); //remove popular array elements
                do {
                    photo_url = cache_hashtag.pop();
                } while (typeof photo_url === "undefined" && cache_hashtag.length > 0);
                self.utils.logger("[INFO]", "like", "current photo url " + photo_url);
                this.utils.sleep(this.utils.random_interval(4, 8));
                self.bot.url(photo_url);
            } catch (err) {
                self.utils.logger("[ERROR]", "like", "like_get_urlpic error" + err);
                self.utils.screenshot(self.bot, "like", "like_get_urlpic_error");
            }
        } else {
            do {
                photo_url = cache_hashtag.pop();
            } while (typeof photo_url === "undefined" && cache_hashtag.length > 0);
            self.utils.logger("[INFO]", "like", "current photo url from cache " + photo_url);
            this.utils.sleep(this.utils.random_interval(4, 8));
            self.bot.url(photo_url);
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
        let self = this;
        let status = "";
        let text = "";
        self.utils.logger("[INFO]", "like", "try heart like");
        try {
            text = await this.bot.getText('.coreSpriteHeartOpen');
            if (text == "Like") {
                self.bot.click("main article:nth-child(1) section:nth-child(1) a:nth-child(1)");
                status = 1;
            } else {
                self.utils.logger("[INFO]", "like", "bot like this photo in before loop, use hashtag with more new photos");
                status = 0;
            }
        } catch (err) {
            if (self.config.debug == true)
                self.utils.logger("[DEBUG]", "like", err);
            self.utils.logger("[INFO]", "like", "bot like this photo in before loop, use hashtag with more new photos");
            status = 0;
        }
        this.utils.screenshot(this.bot, "like", "last_like");
        this.utils.sleep(this.utils.random_interval(4, 8));
        if (status == 1) {
            try {
                text = await this.bot.getText('.coreSpriteHeartOpen');
                self.utils.logger("[WARNING]", "like", "</3");
                self.utils.logger("[WARNING]", "like", "error bot :( not like photo, go to next");
                self.utils.logger("[WARNING]", "like", "You are in soft ban, stop bot 24h... If this message appear all time stop bot for 24h...");
                status = 0;
            } catch (err) {
                self.utils.logger("[INFO]", "like", "<3");
                status = 1;
            }
        } else {
            self.utils.logger("[WARNING]", "like", "</3");
            self.utils.logger("[WARNING]", "like", "You like this previously, change hashtag ig have few photos");
        }
        this.utils.sleep(this.utils.random_interval(2, 5));
        this.utils.screenshot(this.bot, "like", "last_like_after");
        return status;
    }

}

module.exports = (bot, config, utils) => { return new Likemode_classic(bot, config, utils); };