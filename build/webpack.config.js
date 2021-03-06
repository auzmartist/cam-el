const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const EsmWebpackPlugin = require('@purtuga/esm-webpack-plugin')

const resolve = (rel) => path.resolve(__dirname, '..', rel)

const load = (test, ...use) => ({test, use, exclude: /node_modules/})

module.exports = (env) => ({
	mode: (env.prod || env.esm) ? 'production' : 'development',
	entry: {
		'cam-el': resolve('src/index.ts'),
	},
	output: {
		path: resolve('dist'),
		filename: `[name]${env.esm ? '.esm' : ''}.js`,
		library: `CamEl`,
		libraryTarget: env.esm ? 'var' : 'umd',
	},
	module: {
		rules: [
			load(/\.(j|t)s?$/, 'babel-loader'),
			load(/\.styl(us)?$/, 'css-loader', 'stylus-loader'),
			{
				...load(/\.css$/, 'css-loader'),
				exclude: /node_modules\/(?!(highlight\.js))/,
			},
		]
	},
	resolve: {
		extensions: ['.ts', '.js', '.json', '.styl', '.css'],
		alias: {
			'src': resolve('src'),
			'style': resolve('src/style'),
		},
	},
	plugins: [
		env.esm ? new EsmWebpackPlugin() : {apply: () => null},
		env.dev ? new HtmlWebpackPlugin({
			template: resolve('build/index.html'),
			inject: 'head',
		}) : {apply: () => null},
	],
	devServer: {
		port: 9354,
		historyApiFallback: true,
	}
})
