/**
 * Routes
 * =====================
 * Possible strategy / modes
 *
 * @contributors: Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
 *                Ilya Chubarov [@agoalofalife] <agoalofalife@gmail.com>
 * @license: MIT License
 *
 */
module.exports = {
	"Likemode_classic": require("../modes/likemode_classic"),
	"Likemode_classic_location": require("../modes/likemode_classic_location"),
	"Likemode_realistic": require("../modes/likemode_realistic"),
	"Likemode_realistic_location": require("../modes/likemode_realistic_location"),
	"Likemode_superlike": require("../modes/likemode_superlike"),
	"Likemode_superlike_location": require("../modes/likemode_superlike_location"),
	"Commentmode_realistic": require("../modes/commentmode_realistic"),
	"Commentmode_realistic_location": require("../modes/commentmode_realistic_location"),
	"Fdfmode_realistic": require("../modes/fdfmode_realistic"),
	"Likemode_competitor_users": require("../modes/likemode_competitor_users")
};