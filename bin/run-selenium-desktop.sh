#!/bin/sh
java -Xms512m -Xmx2048m -Dwebdriver.chrome.driver="./bin/chromedriver" -jar ./bin/selenium-server-standalone.jar
