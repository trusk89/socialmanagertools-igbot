#!/bin/sh
xvfb-run --server-args='-screen 0, 1920x1080x16' java -Xms512m -Xmx2048m -Dwebdriver.chrome.driver="./bin/chromedriver" -jar ./bin/selenium-server-standalone.jar