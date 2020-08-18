const path = require('path')
// import path from 'path'
const webpack = require('webpack')
const mode = process.env.NODE_ENV || 'production'

module.exports = {
  output: {
    filename: `worker.${mode}.js`,
    path: path.join(__dirname, 'dist')
  },
  mode,
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: []
  },
  optimization: {
    // usedExports: true
    // sideEffects: true
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  }
}
