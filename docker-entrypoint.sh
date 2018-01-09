#!/bin/sh

if [ -z ${REMOTE_THEME} ]
then
  cp /app/themes/${THEME}.less /app/theme.less
else
  wget -O /app/theme.scss ${REMOTE_THEME}
fi

node_modules/less/bin/lessc --compress style.less static/style.css

yarn run build
yarn start