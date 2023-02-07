if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({
    path: '../.env'
  })
}

const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    publicPath: '',
    path: `${__dirname}/public`,
    filename: './app.js'
  },
  devServer: {
    port: 8082,
    static: './public'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      modules: `${__dirname}/node_modules`,
      app: `${__dirname}/src`
    },
    fallback: {
      stream: false
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'app.css'
    }),
    new HtmlWebpackPlugin({
      filename: `${__dirname}/public/index.html`,
      template: 'src/index.html',
      chunksSortMode: 'none'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development'),
        'API_HOST': JSON.stringify('http://localhost:3000'),
        'STRIPE_PUBKEY': JSON.stringify(process.env.STRIPE_PUBKEY),
        'SLACK_CHANNEL_INVITE_LINK': JSON.stringify(process.env.SLACK_CHANNEL_INVITE_LINK)
      }
    })
  ],
  module: {
    rules: [{
      test: /.js[x]?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react'],
        plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/plugin-proposal-class-properties']
      }
    }, {
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader']
    }, {
      test: /\.(woff|woff2|ttf|eot|svg)$/,
      loader: 'file-loader'
    },
    { test: /\.(png|jpg)$/, loader: 'url-loader', options: { limit: 8192 } }
    ]
  }
}
