if(process.env.NODE_ENV != 'production') {
  require('dotenv').config({
    path: '../.env'
  });
}

const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
	entry: './src/index.js',
	output: {
		path: __dirname + '/public',
		filename: './app.js'
	},
	devServer: {
		port: 8082,
		contentBase: './public'
	},
	resolve: {
		extensions: ['.js', '.jsx'],
		alias: {
			modules: __dirname + '/node_modules'
		}
	},
	plugins: [
		new ExtractTextPlugin('app.css'),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development'),
        'API_HOST': JSON.stringify('http://localhost:3000'),
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
				plugins: ['transform-object-rest-spread']
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
