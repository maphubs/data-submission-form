// eslint-disable-next-line no-var
var getenv = require('getenv')
require('dotenv').config()

module.exports = {
  port: getenv.int('PORT', 4006)
}
