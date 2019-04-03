/**
 * Translation: English
 * =====================
 * How translate:
 * Chalk: chalk is npm plugin to colorize text in terminal, example: {italic.bold.rgb(46, 204, 113) TEXT_TEXT_TEXT }
 *        don't translate italic.bold.rgb but translate TEXT_TEXT_TEXT before of }
 *
 * Keys:  don't translate keywords on left, example: {"done":"i'm here"}
 *        word <done> on left side is keyword, ever in English. Translate only phrases on right side of two dots
 *
 * Param: don't translate words between ## ##, example: ##ciao##
 *
 * @link: https://docs.socialmanager.tools/translate/README.md
 *
 * @author:  Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
 * @license: CC BY 4.0 License
 *
 */
const chalk = require("chalk");
module.exports = {
	"loading": chalk`loading...`,
	"done": chalk`{italic.bold.rgb(46, 204, 113) |> DONE }`,
	"done_cheese": chalk`cheese! {italic.bold.rgb(46, 204, 113) |> DONE }!`,
	"screenshot_disabled": chalk`in config.js screenshot flag is disabled`,
	"mode_not_exist": chalk`mode ##mode## not exist!`,
	"shutdown_wait_30sec": chalk`shutdown... wait ~30sec than the bot stopping...`,
	"liked_previously": chalk`{italic.bold.rgb(246, 187, 67) </3} liked previously, use hashtag/localization with more photos. SKIPPED...`,
	"follow_whitelist_skipped": chalk`{italic.bold.rgb(246, 187, 67) Follow/Defollow KO!} ##username## is in whitelist, SKIPPED...`,
	"liked_ok": chalk`{italic.bold.rgb(46, 204, 113) <3}`,
	"liked_ko": chalk`{italic.bold.rgb(192, 57, 43) </3}`,
	"follow_ok": chalk`{italic.bold.rgb(46, 204, 113) |> Follow! OK!}`,
	"follow_ko": chalk`{italic.bold.rgb(192, 57, 43) |> Follow! KO!}`,
	"defollow_ok": chalk`{italic.bold.rgb(46, 204, 113) |> DeFollow! OK!}`,
	"defollow_ko": chalk`{italic.bold.rgb(192, 57, 43) |> DeFollow! KO!}`,
	"selector_before_click": chalk`css selector before click`,
	"selector_after_click": chalk`css selector after click`,
	"config_need_update": chalk`Your config.js is too old! NEED UPDATE! Check config.js.tpl and update your config.js!`,
	"config_trylegacy_update": chalk`Bot started and try use legacy config... If bot not work is mandatory stop it and update config.js!`,
	"bot_work_support": chalk`Bot work? Please {italic.bold.rgb(46, 204, 113) donate} for support this project!`,
	"bot_work_support_details_1": chalk`This project is {italic.bold.rgb(46, 204, 113) free}, {italic.bold.rgb(46, 204, 113) open source} and I try to provide excellent {italic.bold.rgb(46, 204, 113) free support}. `,
	"bot_work_support_details_2": chalk`Why donate? I work on this project several hours a week or in my spare time and try to keep it up to date and working. `,
	"bot_work_support_details_3": chalk`I do not intend to charge the basic features, but this cannot be done without your financial support, even small. `,
	"bot_work_support_details_4": chalk`There are professional bots with closed source on the Internet that save the password on the cloud for €14/month: `,
	"bot_work_support_details_5": chalk`we want to protect your password and offer you a better product than theirs. `,
	"bot_work_support_details_6": chalk`A lower donation would allow continuous development, ever better quality and the realization of this dream. {white.bold.bgRed  THANK YOU! }`,
	"bot_work_support_patreon": chalk`Donate with {bold.white.bgRgb(251, 102, 78)  |• PATREON }: {italic.underline.rgb(251, 102, 78) http://patreon.ptkdev.io}`,
	"bot_work_support_paypal": chalk`Donate with {bold.white.bgRgb(1, 33, 105)  PayPal     }: {italic.underline.rgb(1, 33, 105) http://paypal.ptkdev.io}`,
	"bot_work_support_kofi": chalk`Donate with {bold.white.bgRgb(66, 163, 203)  Ko-fi      }: {italic.underline.rgb(66, 163, 203) http://coffee.ptkdev.io}`,
	"bot_work_support_sponsors": chalk`You want your website link here? Become a {italic.bold.rgb(22, 160, 133) |> SPONSOR <|} on patreon!`,
	"api_connection_error": chalk`Is impossible contact api.socialmanager.tools server, is wifi on?`,
	"try_write_comment": chalk`try write a comment`,
	"check_comment_exist": chalk`check if exist comment writed previously`,
	"comment_exist": chalk`comment exist, skipped...`,
	"try_set_login_username": chalk`try set a login username`,
	"try_set_login_password": chalk`try set a login password`,
	"try_get_user_username": chalk`try get user username from profile`,
	"try_get_user_description": chalk`try get user description from profile`,
	"try_get_user_name": chalk`try get user name from profile`,
	"try_get_user_website": chalk`try get user website url from profile`,
	"try_get_photo_array": chalk`try get the photos array`,
	"try_scroll": chalk`try scroll div`,
	"try_keep_alive": chalk`try keep alive`,
	"try_get_screenshot": chalk`try get screenshot of page`,
	"try_goto_hashtag_page": chalk`try goto hashtag page`,
	"try_goto_photo_page": chalk`try goto photo page`,
	"try_goto_gps_page": chalk`try goto location page`,
	"try_goto_profile_page": chalk`try goto profile page`,
	"try_goto_login_page": chalk`try goto login page`,
	"try_click_heart": chalk`try click on heart button`,
	"try_click_submitlogin": chalk`try click on submit button on login form`,
	"try_click_submit2fa": chalk`try click on submit button on 2fa form`,
	"try_database_init": chalk`try init database`,
	"try_database_insert": chalk`try insert database values`,
	"try_database_check_exist": chalk`try check if exist database value`,
	"try_check_login_status": chalk`check errors login after submit`,
	"try_check_crash_login_status": chalk`check crash (auto logout) after login submit`,
	"try_check_twofa_crash_status": chalk`check crash (2fa errors) after twofa submit`,
	"try_check_crash_login_status_true": chalk`don't use bot on vps/cloud/aws, if you need run bot on server you need use proxy/vpn`,
	"try_check_twofa_login_status": chalk`check if twofa is enabled...`,
	"try_check_twofa_login_status_twofa_enabled_cli": chalk`You need insert sms pin of twofa, write it in ##pin_path## file and wait 2-3minutes...`,
	"try_check_twofa_login_status_twofa_enabled_ui": chalk`You need insert sms pin of twofa, write it in 2FA PIN input box and wait 2-3minutes...`,
	"twofa_skip": chalk`SKIPPED... 2FA is disabled on your account...`,
	"try_start_mode": chalk`try start mode from config`,
	"try_get_twofa_pin": chalk`try read sms pin`,
	"try_set_twofa_pin": chalk`try write sms pin`,
	"created": chalk`created...`,
	"exist": chalk`exist...`,
	"hashtag_id": chalk`HASHTAG:`,
	"location_id": chalk`GPS ID:`,
	"photo_id": chalk`Photo ID`,
	"photo_ids": chalk`Photo IDs`,
	"photo_urls": chalk`Photo URLs`,
	"cache_size": "cache check, array hashtags size is",
	"try_get_photo_hash_id": "try get photo id (hash)",
	"is_night_bot_sleep": "is night, bot sleep... wait...",
	"finish_fast_like": "finished fast like of 12 photos, wait ##time## minutes",
	"finish_like": "liked 1 photo, wait ##time## minutes",
	"current_time_night": chalk`check night, current time is`,
	"twofa_done_action_required": chalk`{italic.bold.rgb(243, 156, 18) |> DONE }, wait... manual action required..`,
	"twofa_not_work": chalk`If the two authentication does not work, we recommend disabling it. Once the bot is running you can activate it. This is an instagram (random) problem, if you try to login on the website you will receive the same error...`,
	"update_manual": chalk`you need check updates manually, go to: {italic.underline.rgb(255,140,0) http://socialmanager.tools} or {italic.underline.rgb(105,105,105) http://github.com/social-manager-tools}`,
	"update_ok": chalk`Bot is updated! :D`,
	"update_available": chalk`Bot release v##new_version## available! Current version: v##current_version##`
};