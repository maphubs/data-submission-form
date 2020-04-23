// eslint-disable-next-line no-var
var getenv = require('getenv')
require('dotenv').config()

module.exports = {
  MAPBOX_ACCESS_TOKEN: getenv('MAPBOX_ACCESS_TOKEN'),
  MAPHUBS_URL: getenv('MAPHUBS_URL', 'http://maphubs.test:4000'),
  MAPHUBS_LAYER_ID: getenv.int('MAPHUBS_LAYER_ID')
}
