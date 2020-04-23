const path = require('path')
const config = require('./config')
const lessToJS = require('less-vars-to-js')
const withLess = require('@zeit/next-less')
const withCSS = require('@zeit/next-css')
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')
const fs = require('fs')
const pathToMapboxGL = path.resolve(__dirname, './node_modules/mapbox-gl/dist/mapbox-gl.js')
const { ASSET_CDN_PREFIX, NODE_ENV } = process.env
const useCDN = (ASSET_CDN_PREFIX && NODE_ENV === 'production')
const assetPrefix = useCDN ? ASSET_CDN_PREFIX : ''
console.log(`assetPrefix: ${assetPrefix}`)

const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './theme.less'), 'utf8')
)

module.exports = withCSS(withLess({
  publicRuntimeConfig: {
    MAPBOX_ACCESS_TOKEN: config.MAPBOX_ACCESS_TOKEN,
    MAPHUBS_URL: config.MAPHUBS_URL,
    MAPHUBS_LAYER_ID: config.MAPHUBS_LAYER_ID
  },
  exportPathMap: () => {
    return {}
  },
  assetPrefix,
  poweredByHeader: false,
  lessLoaderOptions: {
    modifyVars: themeVariables,
    javascriptEnabled: true
  },
  webpack (config, { dev, isServer }) {
    config.plugins.push(
      new FilterWarningsPlugin({
        exclude: /mini-css-extract-plugin[^]*Conflicting order between:/
      })
    )
    if (dev) {
      config.devtool = 'source-map'
    } else {
      config.devtool = 'source-map'
    }

    config.node = {
      fs: 'empty'
    }

    if (isServer) {
      const antStyles = /antd\/.*?\/style.*?/
      const origExternals = [...config.externals]
      config.externals = [
        (context, request, callback) => {
          if (request.match(antStyles)) return callback()
          if (typeof origExternals[0] === 'function') {
            origExternals[0](context, request, callback)
          } else {
            callback()
          }
        },
        ...(typeof origExternals[0] === 'function' ? [] : origExternals)
      ]

      config.module.rules.unshift({
        test: antStyles,
        use: 'null-loader'
      })
    }

    config.module.rules.push({
      test: /\.(glsl|vert|frag)(\??.*)$/,
      use: [{ loader: 'raw-loader' }]
    })

    if (!config.module.noParse) {
      config.module.noParse = []
    }
    config.module.noParse.push(pathToMapboxGL)

    return config
  }
}))
