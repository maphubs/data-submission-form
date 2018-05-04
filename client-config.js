// eslint-disable-next-line no-var
var getenv = require('getenv')
require('dotenv').config()

module.exports = {
  TILEHOSTING_GEOCODING_API_KEY: getenv('TILEHOSTING_GEOCODING_API_KEY'),
  TILEHOSTING_MAPS_API_KEY: getenv('TILEHOSTING_MAPS_API_KEY'),
  MAPHUBS_URL: getenv('MAPHUBS_URL', 'http://maphubs.test:4000'),
  MAPHUBS_LAYER_ID: getenv.int('MAPHUBS_LAYER_ID')
}
