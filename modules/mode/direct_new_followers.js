/**
 * MODE: Direct_new_followers
 * =====================
 * Monitors activities and sends a direct message to new followers and sleep 5 min.
 *
 * @author:     Andrea [@m0s4ik] 
 * @license:    This code and contributions have 'GNU General Public License v3'
 *
 */
const Manager_state = require("../common/state").Manager_state;
class Direct_new_followers extends Manager_state {
	constructor(bot, config, utils, db) {
		super();
		this.bot = bot;
		this.config = config;
		this.utils = utils;
		this.db = db["logs"];
		this.db_followers = db["followers"];
		this.STATE = require("../common/state").STATE;
		this.STATE_EVENTS = require("../common/state").EVENTS;
		this.Log = require("../logger/log");
		this.LOG_NAME = "direct_new_followers";
		this.account = this.config.instagram_username;
		this.url_instagram = "https://www.instagram.com/";
		this.activity_url = "https://www.instagram.com/accounts/activity/"
		this.account_url = `${this.url_instagram}${this.account}`;
		this.cache_followers = [];
		this.log = new this.Log(this.LOG_NAME, this.config);
	}

	/**
	 * Database init
	 * =====================
	 * Save users nickname and other information
	 *
	 */
	async init_db() {
		let self = this;

		await this.db_followers.serialize(async function () {
			self.db_followers.run("CREATE TABLE IF NOT EXISTS direct_sended (id INTEGER PRIMARY KEY AUTOINCREMENT, account TEXT, username TEXT,  inserted_at DATETIME DEFAULT CURRENT_TIMESTAMP)", function (err) {
				if (err) {
					self.log.error(`init_db_fdf: ${err}`);
				}
			});
		});
	}

	/**
	 * Get all usernames already sended 
	 * =====================
	 * SQL get all usernames
	 *
	 */
	async get_all_usernames_from_database() {
		let self = this;
		return new Promise(function (resolve) {
			self.db_followers.all("SELECT username FROM direct_sended WHERE account = ? ORDER BY id ASC", self.config.instagram_username, function (err, row) {
				if (err) {
					self.log.warning(`get_all_users_from_database() error select ${err}`);
				}
				resolve(row || []);
			});
		});
	}


	/**
	 * Open activity page
	 * @return {Promise<void>}
	 */
	async open_activity_page() {

		try {
			await this.bot.goto(this.activity_url);
		} catch (err) {
			this.log.error(`goto ${err}`);
		}

		await this.utils.sleep(this.utils.random_interval(3, 6));

		await this.utils.screenshot(this.LOG_NAME, "activity_page");
	}

	/**
	 * Check notify dialog
	 * @return {Promise<void>}
	 */
	async check_notify_dialog() {

		if (await this.bot.$('[role="dialog"] button:nth-child(2)')) {

			if (this.utils.is_debug())
				this.log.debug(`notify box`);

			let buttonNotif = await this.bot.$('[role="dialog"] button:nth-child(2)');
			await buttonNotif.click();
		} else if (this.utils.is_debug())
			this.log.debug(`no notify box`);
	}

	/**
	 *
	 * @return {Promise<void>}
	 */
	async get_new_followers() {
		this.log.info("get new followers");

		if (this.cache_followers.length <= 0) {

			try {

				this.cache_followers = await this.bot.$$eval('main [role="button"]', nodes => nodes.filter((node) => {
					return node.querySelector('button')
				}).map(function (node) {
					return {
						username: node.querySelector('a').getAttribute('href').replace(/\//g, ''),
						datetime: node.querySelector('time').getAttribute('datetime')
					}
				}));

				await this.utils.sleep(this.utils.random_interval(10, 15));

				if (this.utils.is_debug()) {
					this.log.debug(`array followers ${this.cache_followers.map(u => u.username)}`);
				}

			} catch (err) {
				this.cache_followers = [];
				this.log.error(`get url followers error ${err}`);
				await this.utils.screenshot(this.LOG_NAME, "get_url_followers_error");
			}
		}
	}

	/**
	 * new_direct_message:
	 * =====================
	 * Send direct message to username
	 *
	 */
	async new_direct_message(username) {
		this.log.info("try send direct message");

		let inbox_url = "https://www.instagram.com/direct/new/";

		await this.bot.goto(inbox_url);

		await this.utils.sleep(this.utils.random_interval(3, 6));

		try {

			await this.bot.waitForSelector('[role="dialog"]', {
				timeout: 5000
			});
			// let button = await this.bot.$("section:nth-child(1) button");
			// await button.click();

			await this.utils.sleep(this.utils.random_interval(3, 6));

			await this.bot.keyboard.type(username, {
				delay: 100
			})

			await this.utils.sleep(this.utils.random_interval(3, 6));

			let buttoAddUser = await this.bot.$('[role="dialog"] [role="button"]');
			await buttoAddUser.click();

			await this.utils.sleep(this.utils.random_interval(3, 6));

			let buttonSend = await this.bot.$('[role="dialog"] div:nth-child(3) button')
			await buttonSend.click();

			await this.utils.sleep(this.utils.random_interval(3, 6));

			await this.bot.waitForSelector("section textarea", {
				timeout: 5000
			});


			//	String.fromCharCode(13)

			await this.bot.type('section textarea', `${this.config.bot_direct_message}${String.fromCharCode(13)}`, {
				delay: 100
			});

			await this.utils.sleep(this.utils.random_interval(3, 6));


			await this.db_followers.run("INSERT INTO direct_sended (account, username) VALUES (?, ?)", this.config.instagram_username, username);

			this.log.info("Sended!");

			this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.OK);
		} catch (err) {
			if (this.utils.is_debug()) {
				this.log.debug(err);
			}

			this.log.warning("Send Failde");
			this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.ERROR);
		}

		await this.utils.sleep(this.utils.random_interval(3, 6));

		await this.utils.screenshot(this.LOG_NAME, "new_direct_message");
	}

	/**
	 * Direct to new followers
	 * =====================
	 *
	 */
	async start() {
		this.log.info("direct_new_followers");

		let today = "";

		await this.init_db();

		let alive = true;
		do {
			alive = await this.utils.keep_alive();
			if (alive == false) {
				break;
			}

			today = new Date();
			this.log.info(`time night: ${parseInt(`${today.getHours()}${today.getMinutes() < 10 ? "0" : ""}${today.getMinutes()}`)}`);

			if (this.config.bot_sleep_night === false) {
				this.config.bot_start_sleep = "00:00";
			}
			if ((parseInt(`${today.getHours()}${today.getMinutes() < 10 ? "0" : ""}${today.getMinutes()}`) >= (this.config.bot_start_sleep).replace(":", ""))) {

				await this.check_notify_dialog()

				await this.utils.sleep(this.utils.random_interval(3, 6));


				this.log.info(`loading... ${new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds())}`);
				this.log.info(`cache array size ${this.cache_followers.length}`);

				if (this.cache_followers.length <= 0) {
					await this.open_activity_page();

					await this.utils.sleep(this.utils.random_interval(3, 6));

					await this.get_new_followers();
				}

				const db_users_followed = await this.get_all_usernames_from_database();
				this.log.info(`directs already sended count ${db_users_followed.length}`);

				this.cache_followers = this.cache_followers.filter(x => !db_users_followed.map(u => u.username).includes(x.username));

				this.cache_followers = this.cache_followers.filter(x => new Date(x.datetime).getTime() > new Date(new Date().setHours(new Date().getHours() - this.config.bot_direct_follower_from)).getTime())

				if (this.cache_followers.length > 0)
					await this.new_direct_message(this.cache_followers[0].username);

				alive = await this.utils.keep_alive();
				if (alive == false) {
					break;
				}

				this.log.info(`finish send direct, bot sleep ${this.config.bot_direct_pause} seconds`);

				await this.utils.sleep(this.utils.random_interval(this.config.bot_direct_pause - 5, this.config.bot_direct_pause + 5));


			} else {
				this.log.info("is night, bot sleep");
				await this.utils.sleep(this.utils.random_interval(60 * 4, 60 * 5));
			}

		} while (true);
	}

}

module.exports = (bot, config, utils, db) => {
	return new Direct_new_followers(bot, config, utils, db);
};