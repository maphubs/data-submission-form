const { WebpackBundleSizeAnalyzerPlugin } = require('webpack-bundle-size-analyzer')
const path = require('path')
const { ANALYZE, ASSET_CDN_PREFIX } = process.env
const useCDN = (ASSET_CDN_PREFIX && process.NODE_ENV === 'production')

module.exports = {
  assetPrefix: useCDN ? ASSET_CDN_PREFIX : '',
  webpack (config) {
    if (ANALYZE) {
      config.plugins.push(new WebpackBundleSizeAnalyzerPlugin('stats.txt'))
    }

    config.node = {
      fs: 'empty'
    }

    config.module.rules.push(
      {
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
      }
    )

    return config
  }
}
