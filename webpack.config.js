var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/static/index.html',
  filename: 'index.html',
  inject: 'body'
})

module.exports = {
  entry: {
    index: './src/index.js',
    leaderboard:  './src/leaderboard.js'
  },
  output: {
    path: __dirname + '/dist',
    filename: "[name]_bundle.js"
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
      {test: /\.css$/, loader: ExtractTextPlugin.extract(
        'style-loader',
        'css-loader'
      ) }
    ]
  },
  plugins: [new ExtractTextPlugin('styles.css'), HtmlWebpackPluginConfig]
}
