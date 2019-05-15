/**
 * Auth
 * =====================
 * Auth action can you can on bot from /modules/auth folder
 *
 * @contributors: Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
 *
 * @license: This code and contributions have 'MIT License'
 *
 */
module.exports = {
	"Login": require("../auth/login"),
	"Twofa": require("../auth/2fa")
};