// eslint-disable-next-line no-var
var getenv = require('getenv')
require('dotenv').config()

module.exports = {
  OSMNAMES_API_KEY: getenv('OSMNAMES_API_KEY'),
  MAPHUBS_URL: getenv('MAPHUBS_URL', 'http://maphubs.test:4000'),
  MAPHUBS_LAYER_ID: getenv.int('MAPHUBS_LAYER_ID')
}
