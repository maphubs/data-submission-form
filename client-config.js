// eslint-disable-next-line no-var
var getenv = require('getenv')
require('dotenv').config()

module.exports = {
  MAPZEN_API: getenv('MAPZEN_API'),
  MAPHUBS_URL: getenv('MAPHUBS_URL', 'http://maphubs.test:4000'),
  MAPHUBS_LAYER_ID: getenv.int('MAPHUBS_LAYER_ID')
}
