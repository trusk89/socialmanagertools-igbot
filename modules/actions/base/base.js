
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

    run(param){
        this.before().call(this.context);
        this.action(param);
        this.after().call(this.context);
    }
}
