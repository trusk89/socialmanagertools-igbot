#!/bin/sh
xvfb-run --server-args='-screen 0, 1920x1080x16' selenium-standalone start -Xms512m -Xmx2048m --version=3.8.1 --drivers.chrome.version=2.35 