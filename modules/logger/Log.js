const TYPES_LOG = {
    INFO:'[INFO]',
    WARNING:'[WARNING]',
    ERROR:'[ERROR]',
    DEBUG:'[DEBUG]'
};

const routes_log = require('./../../routes/log');
const config = require('./../../config');

module.exports = class Log{
    constructor(func){
        this.func = func;
        let Channel = routes_log[config.log.driver];
        this.setChannel(new Channel());
    }

    /**
     *
     * @param interfaceChannel
     */
    setChannel(interfaceChannel){
        this.channel = interfaceChannel;
    }

    info(message){
        this.channel.log(TYPES_LOG.INFO, this.func, message);
    }
    warning(message){
        this.channel.log(TYPES_LOG.WARNING, this.func, message);
    }
    error(message){
        this.channel.log(TYPES_LOG.ERROR, this.func, message);
    }
    debug(message){
        this.channel.log(TYPES_LOG.DEBUG, this.func, message);
    }
};

