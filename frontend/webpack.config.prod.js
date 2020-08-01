const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// Minify hangs in 92% when build in production, so now we are testing the uglify above
// const MinifyPlugin = require('babel-minify-webpack-plugin')

module.exports = {
  mode: 'production',
  optimization: {
    minimizer: [new UglifyJsPlugin()],
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      // minimum chunk size 30KB
      minSize: 30000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](@material-ui)[\\/]/,
          name: 'vendor'
        },
      },
    },
  },
  entry: './src/index.js',
  output: {
    path: `${__dirname}/public`,
    filename: '[name].[hash].js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      modules: `${__dirname}/node_modules`,
      app: `${__dirname}/src`
    }
  },
  plugins: [
    // new MinifyPlugin(),
    new HtmlWebpackPlugin({
      filename: `${__dirname}/public/index.html`,
      template: 'src/index.html',
      chunksSortMode: 'none'
    }),
    new MiniCssExtractPlugin({
      filename: 'app.css'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        'API_HOST': JSON.stringify(process.env.API_HOST),
        'STRIPE_PUBKEY': JSON.stringify(process.env.STRIPE_PUBKEY),
        'SLACK_CHANNEL_INVITE_LINK': JSON.stringify(process.env.SLACK_CHANNEL_INVITE_LINK)
      }
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['!favicon-gitpay.ico']
    })
  ],
  module: {
    rules: [{
      test: /.js[x]?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: [['es2015', { 'modules': false }], 'react'],
        plugins: ['transform-object-rest-spread', 'transform-class-properties']
      }
    }, {
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader']
    }, {
      test: /\.(woff|woff2|ttf|eot|svg)$/,
      loader: 'file-loader'
    },
    { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }
    ]
  }
}
