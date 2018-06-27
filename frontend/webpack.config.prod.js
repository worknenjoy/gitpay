const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const MinifyPlugin = require("babel-minify-webpack-plugin")

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/public',
    filename: './app.js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      modules: __dirname + '/node_modules'
    }
  },
  plugins: [
    new MinifyPlugin(),
    new ExtractTextPlugin('app.css'),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        'API_HOST': JSON.stringify(process.env.API_HOST),
        'STRIPE_PUBKEY': JSON.stringify(process.env.STRIPE_PUBKEY)
      }
    })
  ],
  module: {
    loaders: [{
      test: /.js[x]?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'react'],
        plugins: ['transform-object-rest-spread', 'transform-class-properties']
      }
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader'})
    }, {
      test: /\.woff|.woff2|.ttf|.eot|.svg*.*$/,
      loader: 'file-loader'
    },
      { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }
    ]
  }
}
