/**
 * Social Manager Tools: Instagram Bot API
 * =====================
 * Scraping instagram website with love and nodejs
 *
 * @contributors: Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
 *
 *
 * @license: This code and contributions have 'MIT License'
 *           Permission is hereby granted, free of charge, to any person obtaining a copy
 *           of this software and associated documentation files (the "Software"), to deal
 *           in the Software without restriction, including without limitation the rights
 *           to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *           copies of the Software, and to permit persons to whom the Software is
 *           furnished to do so, subject to the following conditions:
 *
 *           The above copyright notice and this permission notice shall be included in all
 *           copies or substantial portions of the Software.
 *
 *           THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *           IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *           FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *           AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *           LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *           OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *           SOFTWARE.
 *
 * @link:    Homepage: https://socialmanager.tools
 *           Docs:     https://docs.socialmanager.tools
 *           NPM:      https://www.npmjs.com/package/socialmanagertools-igbot
 *           GitHub:   https://github.com/social-manager-tools/socialmanagertools-igbot
 *
 */

const argv = require("yargs").argv;
const config = (argv.config ? require(argv.config) : require("./configs/config.js"));

const Bot = require("./modules/core/lib");
let bot = new Bot(config);

(async() => {
	await bot.start();

	let api = await bot.api();

	let response = await api.login.flow();

	if (response.status) {
		response = await api.twofa.flow();
	}

	if (response.status) {
		response = await api.challenge.flow();
	}

	if (response.status) {
		response = await api.mode.flow();
	}

	// await bot.stop();
})();