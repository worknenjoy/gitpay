const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// Minify hangs in 92% when build in production, so now we are testing the uglify above
// const MinifyPlugin = require('babel-minify-webpack-plugin')

module.exports = {
  mode: 'production',
  /*
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
  */
  entry: './src/index.js',
  output: {
    publicPath: '',
    path: `${__dirname}/public`,
    filename: '[name].[hash].js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts', '.json'],
    alias: {
      modules: `${__dirname}/node_modules`,
      app: `${__dirname}/src`,
      images: path.resolve(__dirname, 'src/images'),
      'design-library': path.resolve(__dirname, 'src/components/design-library')
    },
    fallback: {
      stream: 'stream-browserify',
      buffer: require.resolve('buffer')
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
        NODE_ENV: JSON.stringify('production'),
        API_HOST: JSON.stringify(process.env.API_HOST),
        STRIPE_PUBKEY: JSON.stringify(process.env.STRIPE_PUBKEY),
        SLACK_CHANNEL_INVITE_LINK: JSON.stringify(process.env.SLACK_CHANNEL_INVITE_LINK),
        GOOGLE_RECAPTCHA_SITE_KEY: JSON.stringify(process.env.GOOGLE_RECAPTCHA_SITE_KEY)
      }
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['!favicon-gitpay.ico']
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
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
          plugins: [
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-proposal-class-properties'
          ]
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
      { test: /\.(png|jpg)$/, loader: 'url-loader', options: { limit: 8192 } }
    ]
  }
}
