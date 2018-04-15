const config = require('../../../config');

/**
 * Get comment for type array
 */
class Array_source {
    constructor() {
        this.source = config.comment_mode.comments.source;
    }

    get_random_comment() {
        // if array is empty
        if (this.source.length === 0) return '';
        return this.source[Math.floor(Math.random() * this.source.length)];
    }
}

module.exports = () => { return new Array_source() };