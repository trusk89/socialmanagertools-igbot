const LOG_NAME = 'like';

const Manager_state = require('../modules/base/state').Manager_state;
const STATE = require('../modules/base/state').STATE;
const STATE_EVENTS = require('../modules/base/state').EVENTS;

// log
const Log = require('./logger/Log');

/**
 * MODE: Likemode_competitor_users
 * =====================
 * Select account, get random 20 followers, like 20 photo and sleep 15-20min.
 *
 * @author:     Ilya Chubarov [@agoalofalife] <agoalofalife@gmail.com>
 * @license:    This code and contributions have 'GNU General Public License v3'
 * @version:    0.1
 * @changelog:  0.1 initial release
 *
 */
class Likemode_competitor_users extends Manager_state{
    constructor(bot, config, utils) {
        super();
        this.bot = bot;
        this.config = config;
        this.utils = utils;

        this.account = this.config.likemode_competitor_users.account;
        this.url_instagram = 'https://www.instagram.com/';
        this.account_url = `${this.url_instagram}${this.account}`;
        this.cache_hash_tags = [];
        this.log = new Log(LOG_NAME);
    }

    /**
     * Open account page
     * @return {Promise<void>}
     */
    async open_account_page(){
        this.log.info(`current account ${this.account}`);

        try {
            await this.bot.goto(this.account_url);
        } catch (err) {
            this.log.error(`goto ${err}`);
        }

        this.utils.sleep(this.utils.random_interval(4, 8));

        await this.utils.screenshot(LOG_NAME, "account_page");
    }

    /**
     * Get photo url from cache
     * @return {string} url
     */
    getFollowerUrl(){
        let follower_url = "";
        do {
            follower_url = this.cache_hash_tags.pop();
        } while ((typeof follower_url === "undefined" || follower_url.indexOf("www.instagram.com") === -1) && this.cache_hash_tags.length > 0);
        return follower_url;
    }

    /**
     * Scroll followers
     * @return {Promise<Promise<*>|Promise<Object>|*|XPathResult>}
     */
    async scroll_followers(){
        this.log.info('scroll action');

        await this.bot.waitForSelector('div[role="dialog"] div div div ~ div');
            return this.bot.evaluate(() => {
                return new Promise((resolve, reject) => {
                  let counter = 15;
                    let timer = setInterval(() => {
                        document.querySelector('div[role="dialog"] div div div ~ div').scrollBy(0, 5000);
                        if  (counter <= 0) {
                            clearInterval(timer);
                            resolve();
                        } else {
                            counter--;
                        }
                    }, 5000);
                })
            });
    }

    /**
     * Mix array url followers and get 20 url
     */
    get_random_follower_url(){
        this.cache_hash_tags = this.utils.mix_array(this.cache_hash_tags).splice(0, 20);
    }

    /**
     * Open page follower
     * @return {Promise<void>}
     */
    async open_follower_account(){
        let follower_url = '';
        if (this.cache_hash_tags.length <= 0) {
            follower_url = this.getFollowerUrl();

            this.log.info(`current follower url ${follower_url}`);
            if (typeof follower_url === "undefined")
                this.log.warning('error follower url.');

            this.utils.sleep(this.utils.random_interval(4, 8));
            await this.bot.goto(follower_url);
        } else {
            follower_url = this.getFollowerUrl();
            this.log.info(`current url from cache ${follower_url}`);
            this.utils.sleep(this.utils.random_interval(4, 8));

            try {
                await this.bot.goto(follower_url);
            } catch (err) {
                this.log.error(`goto ${err}`);
            }
        }
        this.utils.sleep(this.utils.random_interval(4, 8));
    }

    /**
     *
     * @return {Promise<void>}
     */
    async get_followers(){
        this.log.info('get followers');

        if (this.cache_hash_tags.length <= 0) {
            let selector_followers_count = 'main article:nth-child(1) header section ul li:nth-child(2) a';
            await this.bot.waitForSelector(selector_followers_count);
            let area_count_followers = await this.bot.$(selector_followers_count);
            await area_count_followers.click();

            // scroll
            await this.scroll_followers(this.bot);

            try {
                this.cache_hash_tags = await this.bot.$$eval('div[role="dialog"] div div div ul li div div a', hrefs => hrefs.map((a) => {
                    return a.href;
                }));

                this.get_random_follower_url();

                this.utils.sleep(this.utils.random_interval(10, 15));

                if (this.utils.isDebug())
                    this.log.debug(`array followers ${this.cache_hash_tags}`);

            } catch (err) {
                this.cache_hash_tags = [];
                this.log.error(`get url followers error ${err}`);
                await this.utils.screenshot(LOG_NAME, "get_url_followers_error");
            }
        }
    }

    /**
     * likemode_competitor_users:
     * =====================
     * Click on heart and verify if instagram not (soft) ban you
     *
     */
    async like_click_heart() {
        this.log.info(`try heart like random photo from account`);

        let heart = "";
        let photos = await this.bot.$$eval('article>div div div div a', hrefs => hrefs.map((a) => {
            return a.href;
        }));
        if  (photos.length === 0) {
            this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.ERROR);
            return;
        }
        let photo_url = this.utils.mix_array(photos).splice(0, 1).shift();
        await this.bot.goto(photo_url);

        try {
            heart = await this.bot.$('.coreSpriteHeartOpen');
            if (heart !== null) {
                this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.OK);
            } else {
                this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.ERROR);
            }

            if (this.isOk()) {
                await this.bot.waitForSelector('.coreSpriteHeartOpen');
                let button = await this.bot.$('.coreSpriteHeartOpen');
                await button.click();
            } else {
                this.log.info(`bot like this photo in before loop, use hashtag with more new photos`);
                this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.ERROR);
            }
        } catch (err) {
            if (this.utils.isDebug())
                this.log.debug(err);
            this.log.info('bot like this photo in before loop, use hashtag with more new photos');
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
                    this.log.warning('</3');
                    this.log.warning('error bot :( not like photo, now bot sleep 5-10min');
                    this.log.warning('You are in possible soft ban... If this message appear all time stop bot for 24h...');
                    this.utils.sleep(this.utils.random_interval(60 * 5, 60 * 10));
                } else if (this.isOk()) {
                    this.log.info('<3');
                }
            } catch (err) {
                if (this.utils.isDebug())
                    this.log.debug(err);
                this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.ERROR);
            }
        } else {
            this.log.warning('</3');
            this.log.warning('You like this previously, change hashtag ig have few photos');
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
        this.log.info('competitor_users');

        let today = "";

        do {
            today = new Date();
            this.log.info("time night: " + (parseInt(today.getHours() + "" + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes())));

            if (parseInt(today.getHours() + "" + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes()) >= (this.config.bot_sleep_night).replace(":", "")) {

                this.log.info("loading... " + new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds()));
                this.log.info("cache array size " + this.cache_hash_tags.length);

                if (this.cache_hash_tags.length <= 0)
                    await this.open_account_page();

                this.utils.sleep(this.utils.random_interval(4, 8));

                await this.get_followers();
                await this.open_follower_account();

                this.utils.sleep(this.utils.random_interval(4, 8));

                await this.like_click_heart();

                if (this.cache_hash_tags.length < 9 || this.isReady()) //remove popular photos
                    this.cache_hash_tags = [];

                if (this.cache_hash_tags.length <= 0 && this.isNotReady()) {
                    this.log.info("finish fast like, bot sleep " + this.config.bot_fastlike_min + "-" + this.config.bot_fastlike_max + " minutes");
                    this.cache_hash_tags = [];
                    this.utils.sleep(this.utils.random_interval(60 * this.config.bot_fastlike_min, 60 * this.config.bot_fastlike_max));
                }
            } else {
                this.log.info('is night, bot sleep');
                this.utils.sleep(this.utils.random_interval(60 * 4, 60 * 5));
            }
        } while (true);
    }

}

module.exports = (bot, config, utils) => { return new Likemode_competitor_users(bot, config, utils); };