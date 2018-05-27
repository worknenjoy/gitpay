const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJS = require('uglifyjs-webpack-plugin')

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
    new UglifyJS(),
		new ExtractTextPlugin('app.css')
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
