#!/bin/sh
java -Xms512m -Xmx2048m -jar -Dwebdriver.chrome.driver="./bin/chromedriver" ./bin/selenium-server-standalone.jar