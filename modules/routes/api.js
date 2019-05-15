/**
 * Api
 * =====================
 * Actions can you can on bot from /modules/api folder
 *
 * @contributors: Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
 *
 * @license: This code and contributions have 'MIT License'
 *
 */
module.exports = {
	"Click": require("../api/click"),
	"Check": require("../api/check"),
	"Goto": require("../api/goto"),
	"Read": require("../api/read"),
	"Write": require("../api/write"),
	"Page": require("../api/page"),
	"Stories": require("../api/stories"),
	"Database": require("../api/database"),
	"Analytics": require("../api/analytics")
};