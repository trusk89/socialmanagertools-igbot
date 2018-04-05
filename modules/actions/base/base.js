
/**
 * Base functional actions components..
 */
class Base_actions{
    constructor(context){
        this.context = context;
    }

    /**
     * Method call before then run base method 'action'
     */
    before(){}

    /**
     * Method call after run base method 'action'
     */
    after(){};

    run(){
        this.before().call(this.context);
        this.action().call(this.context);
        this.after().call(this.context);
    }
}
