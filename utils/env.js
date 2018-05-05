// eslint-disable-next-line import/no-mutable-exports
let config
if (typeof window !== 'undefined') {
  // eslint-disable-next-line import/no-mutable-exports
  config = window.__ENV__
} else {
  // eslint-disable-next-line import/no-mutable-exports
  config = require('../client-config')
}
export default config
