# Setup - Raspbian
#### 1. Install chromium v60
- `apt-get install chromium-browser`

#### 2. Install Node v8
1. `curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh `
2. `sudo bash nodesource_setup.sh`
3. `rm nodesource_setup.sh`
4. `sudo apt-get install nodejs`

#### 3. Update chromium v60 to v64
```
wget http://launchpadlibrarian.net/252010249/libfontconfig1_2.11.94-0ubuntu1_armhf.deb
wget https://launchpad.net/~chromium-team/+archive/ubuntu/stable/+build/14349678/+files/chromium-codecs-ffmpeg_64.0.3282.167-0ubuntu0.17.10.1_armhf.deb
wget https://launchpad.net/~chromium-team/+archive/ubuntu/stable/+build/14349678/+files/chromium-browser_64.0.3282.167-0ubuntu0.17.10.1_armhf.deb

sudo dpkg -i libfontconfig1_2.11.94-0ubuntu1_armhf.deb
sudo dpkg -i chromium-codecs-ffmpeg_64.0.3282.167-0ubuntu0.17.10.1_armhf.deb
sudp dpkg -i chromium-browser_64.0.3282.167-0ubuntu0.17.10.1_armhf.deb
```

#### 4. Use raspbian chromium, not the node_modules version
- Edit `bot.js` at line ~59 and add chrome path:
- `const browser = await puppeteer.launch({executable_path: '/usr/bin/chromium-browser', headless: config.chrome_headless, args: config.chrome_options});`

#### 5. If you have problem with libc dependieces you need update raspbian to testing:
- Edit `sudo vi /etc/apt/source.list` and switch `stretch` to `testing`
- Run `sudo apt-get update && sudo apt-get dist-upgrade`

# Setup - Debian Server
#### Install bot dependencies:
1. `sudo apt-get install build-essential xvfb libssl-dev curl wget git chromium xauth`

#### Install Node on Debian
1. `curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh `
2. `sudo bash nodesource_setup.sh`
3. `rm nodesource_setup.sh`
4. `sudo apt-get install nodejs`
5. Run `npm install` in `instagram-bot.js` folder

#### Install pm2
1. `sudo npm install -g pm2`

### Run Bot
1. Copy root file `config.js.tpl` to `config.js`, fill it properly and enable `chrome_headless`.
2. Start the bot via `npm run start` or pm2 `npm run start-pm2`

##### Pin
If you received sms or email pin edit `loginpin.txt` and insert it on first line. Wait 3 minutes...

##### Check if work:
See logs: `cat ./logs/debug.log` or png images in ./logs/screenshot
