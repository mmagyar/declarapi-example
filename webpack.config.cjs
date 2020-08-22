const path = require('path')
const webpack = require('webpack')
const mode = process.env.NODE_ENV || 'production'

const spawnSync = require('child_process').spawnSync
const code = spawnSync('npm', ['run', 'generate'], { encoding: 'utf-8' })
console.log(code.stdout)
if (code.status) throw new Error('CODE GENERATION FAILED:' + code.status + ' : ' + code.stderr)

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
