const Base_actions = require('./base/base');

/**
 * Action open page in instagram
 */
class Open_page extends Base_actions{
    constructor(param){
        super();
        this.param = param;
    }

    before(){
        this.log.info(`current hashtag ${this.param.hashTag}`);
    }
    async after(){
        this.utils.sleep(this.utils.random_interval(4, 8));
    }

    async action(){
        try {
            await this.bot.goto(this.param.url);
        } catch (err) {
            this.log.error(`goto ${err}`);
        }
        await this.after();
    }
}

module.exports = (param) => { return new Open_page(param); };