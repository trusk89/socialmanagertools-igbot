// Export module
const EventEmitter = require('events').EventEmitter;

/**
 * Type statuses
 * @type {{OK: number, ERROR: number, READY: number, START: null}}
 */
const STATE = {
    OK: 1,
    ERROR: 0,
    READY: 3,
    START:null
};
const EVENTS = {
    CHANGE_STATUS:'change_status'
};
/**
 *
 * @type {module.State}
 */
class ManagerState extends EventEmitter{
    constructor(params) {
        super(params);
        this._status = STATE.START;
        this.registerHandler();
    }

    /**
     * register handle events in EE
     */
    registerHandler(){
        this.on(EVENTS.CHANGE_STATUS, (status) => {
            this._status = status;
        });
    }

    /**
     * Get current status
     * @return STATE
     */
    getStatus(){
        return this._status;
    }

    /**
     * Check is ready status
     * @return {boolean}
     */
    isReady(){
        return this._status === STATE.READY;
    }

    /**
     * Check is not ready status
     * @return {boolean}
     */
    isNotReady(){
        return this._status !== STATE.READY;
    }
    /**
     * Check is 'ok' status
     * @return {boolean}
     */
    isOk(){
        return this._status === STATE.OK;
    }
    /**
     * Check is 'error' status
     * @return {boolean}
     */
    isError(){
        return this._status === STATE.ERROR;
    }
    /**
     * Check is 'start' status
     * @return {boolean}
     */
    isStart(){
        return this._status === STATE.START;
    }
}

module.exports = {
  STATE:STATE,
  EVENTS:EVENTS,
  ManagerState:ManagerState
};