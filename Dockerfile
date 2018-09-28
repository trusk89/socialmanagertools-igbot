FROM keymetrics/pm2:latest-stretch

WORKDIR /app

ADD . /app

RUN npm install

CMD ["pm2-runtime", "bot.js"]
