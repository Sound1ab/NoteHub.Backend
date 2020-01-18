const path = require('path')
const slsw = require('serverless-webpack')
const nodeExternals = require('webpack-node-externals')
const output = path.join(__dirname, '.webpack')

module.exports = {
  devtool: 'source-map',
  entry: slsw.lib.entries,
  externals: [nodeExternals()],
  mode: slsw.lib.webpack.isLocal ? 'none' : 'production',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: { transpileOnly: true },
        test: /\.tsx?$/,
      },
      {
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
        test: /\.(graphql|gql)$/,
      },
    ],
  },
  optimization: {
    minimize: false,
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs',
    path: output,
  },
  performance: {
    hints: false,
  },
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  target: 'node',
}
