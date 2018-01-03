// eslint-disable-next-line import/no-mutable-exports
let config
if (typeof window !== 'undefined') {
  // eslint-disable-next-line
  config = window.__ENV__
} else {
  // eslint-disable-next-line
  config = require('../client-config')
}
export default config
