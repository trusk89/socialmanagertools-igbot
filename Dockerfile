FROM keymetrics/pm2:8-alpine

WORKDIR /app

ADD . /app

# Install required packages
##############################

RUN apk --update add --no-cache \
  chromium

# Install project dependencies
RUN npm install

# Cleanup
#########

RUN find /usr/local \
    \( -type d -a -name test -o -name tests \) \
    -o \( -type f -a -name '*.pyc' -o -name '*.pyo' \) \
    -exec rm -rf '{}' + \
  && rm -rf /var/cache/apk/*

CMD ["pm2-runtime", "bot.js"]
