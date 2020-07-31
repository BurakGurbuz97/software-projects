const webpack = require("webpack")
module.exports = {
	entry: __dirname + "/src/index.js",
	output: {
		path: __dirname + "/build",
		filename: "bundle.js"
	},
	module: {
		rules: [
			{
				loader: "babel-loader",
				test: /\.js$/,
				exclude: /node_modules/
			}
		]
	},
	devServer: {
		port: 3000,
		historyApiFallback: {
			index: 'index.html'
		},
		proxy: {
			"/api": "http://127.0.0.1:8080",
		},
		contentBase: __dirname +"/public"
	},
	plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]
}