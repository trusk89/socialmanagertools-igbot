const TYPES_LOG = {
    INFO:'[INFO]',
    WARNING:'[WARNING]',
    ERROR:'[ERROR]',
    DEBUG:'[DEBUG]'
};

module.exports = class Log{
    constructor(func){
        this.func = func;
    }
    /**
     *
     * @param interfaceChannel
     */
    setChannel(interfaceChannel){
        this.channel = interfaceChannel;
    }

    info(){
        this.channel.log(TYPES_LOG.INFO);
    }
    warning(){
        this.channel.log(TYPES_LOG.WARNING, this.func);
    }
    error(){
        this.channel.log(TYPES_LOG.ERROR);
    }
    debug(){
        this.channel.log(TYPES_LOG.DEBUG);
    }
};

