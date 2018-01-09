#!/bin/sh
rm static/style.css
node_modules/less/bin/lessc --compress style.less static/style.css