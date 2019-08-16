const webpack = require('webpack')
const path = require('path')

module.exports = [{
  name: 'client',
  mode: 'production',
  context: path.resolve(__dirname),
  entry: {
    javascript: ['babel-polyfill', './src/index.js'],
    typescript: './src/index.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}]