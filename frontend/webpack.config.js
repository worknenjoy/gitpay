const path = require('path')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({
    path: '../.env'
  })
}

const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  node: {
    global: true
  },
  devtool: 'source-map',
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
    extensions: ['.js', '.jsx', '.tsx', '.ts', '.json'],
    alias: {
      modules: `${__dirname}/node_modules`,
      app: `${__dirname}/src`,
      images: path.resolve(__dirname, "src/images"),
      '@material-ui/core': '@mui/material',
      '@material-ui/icons': '@mui/icons-material',
      '@material-ui/lab': '@mui/lab',
      '@material-ui/core/styles': '@mui/material/styles',
      '@material-ui/core/colors': '@mui/material/colors',
      'react-placeholder': require.resolve('react-placeholder'),
      'react-intl-redux': require.resolve('react-intl-redux'),
      'react-redux': require.resolve('react-redux'),
      'redux-thunk': require.resolve('redux-thunk'),
      'react-ga': require.resolve('react-ga'),
      'react-mailchimp-subscribe': require.resolve('react-mailchimp-subscribe'),
      'react-country-region-selector': require.resolve('react-country-region-selector'),
      'react-render-html': require.resolve('react-render-html'),
      'material-ui-phone-number': require.resolve('material-ui-phone-number'),
      'clsx': require.resolve('clsx'),
      'design-library': path.resolve(__dirname, 'src/components/design-library')
    },
    fallback: {
      stream: 'stream-browserify'
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
        'SLACK_CHANNEL_INVITE_LINK': JSON.stringify(process.env.SLACK_CHANNEL_INVITE_LINK),
        'GOOGLE_RECAPTCHA_SITE_KEY': JSON.stringify(process.env.GOOGLE_RECAPTCHA_SITE_KEY)
      }
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser'
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /.js[x]?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/plugin-proposal-class-properties']
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)$/,
        loader: 'file-loader'
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader',
        options: { limit: 8192 }
      },
      {
        compiler: 'html-webpack-plugin',
        resolve: {
          /* ... */
          // This will merge with the current resolve options
          // Arrays will be overridden, but they can use `"..."` to reference to previous items
          // It's not possible to reference previous items except some of them
          // This might be a limitation and we might need to add something to support that
        }
      }
    ]
  }
}
