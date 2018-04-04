const Base_actions = require('./base/base');

/**
 * Action open page in instagram
 */
class Open_page extends Base_actions{
    constructor(){
        super();
    }

    before(){
        let hashTag = this.utils.get_random_hash_tag();
        this.utils.logger(LOG.INFO, LOG_NAME, "current hashtag " + hashTag);
    }
    async after(){
        this.utils.sleep(this.utils.random_interval(4, 8));
        await this.utils.screenshot(LOG_NAME, "last_hashtag");
    }

    async action(param){
        try {
            await this.bot.goto(param.url);
        } catch (err) {
            this.utils.logger(LOG.ERROR, LOG_NAME, "goto " + err);
        }
        await this.after();
    }
}