// const { WebpackBundleSizeAnalyzerPlugin } = require('webpack-bundle-size-analyzer')
const path = require('path')

const pathToMapboxGL = path.resolve(__dirname, './node_modules/mapbox-gl/dist/mapbox-gl.js')
const { ANALYZE, ASSET_CDN_PREFIX } = process.env
const useCDN = (ASSET_CDN_PREFIX && process.NODE_ENV === 'production')

module.exports = {
  assetPrefix: useCDN ? ASSET_CDN_PREFIX : '',
  webpack (config, { dev }) {
    if (dev) {
      config.devtool = 'source-map'
    } else {
      config.devtool = 'source-map'
    }

    if (ANALYZE) {
      // config.plugins.push(new WebpackBundleSizeAnalyzerPlugin('stats.txt'))
    }

    config.resolve = {
      alias: {
        'mapbox-gl': 'mapbox-gl/dist/mapbox-gl.js'
      }
    }

    config.node = {
      fs: 'empty'
    }

    config.module.rules.push({
      test: /\.css$/,
      use: [
        {
          loader: 'emit-file-loader',
          options: {
            name: 'dist/[path][name].[ext].js'
          }
        },
        {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            extends: path.resolve(__dirname, './.babelrc')
          }
        },
        'styled-jsx-css-loader'
      ]
    })

    config.module.rules.push({
      test: /\.(glsl|vert|frag)([\?]?.*)$/,
      use: [{ loader: 'raw-loader' }]
    })

    if (!config.module.noParse) {
      config.module.noParse = []
    }
    config.module.noParse.push(pathToMapboxGL)

    return config
  }
}
