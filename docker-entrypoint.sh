#!/bin/sh

if [ -z ${REMOTE_THEME} ]
then
  cp /app/themes/${THEME}.less /app/theme.less
else
  wget -O /app/theme.scss ${REMOTE_THEME}
fi

yarn run build
yarn start