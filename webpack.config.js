import webpack from 'webpack';
import path from 'path';

import { name } from './package.json';

module.exports = {
  watch: process.env.NODE_ENV !== 'production',
  cache: true,
  devtool: process.env.NODE_ENV === 'production' ? false : '#cheap-module-eval-source-map',
  context: path.join(__dirname, '/src/js'),
  entry: {
    app: './app.js',
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: `${name}.js`,
    chunkFilename: '[name].js',
  },
  resolve: {
    alias: {
      templates: path.resolve(process.cwd(), 'src/templates'),
      app: path.resolve(process.cwd(), 'src/js'),
      api: path.resolve(process.cwd(), 'src/js/api'),
      utils: path.resolve(process.cwd(), 'src/js/utils'),
      core: path.resolve(process.cwd(), 'src/js/core'),
      view: path.resolve(process.cwd(), 'src/js/view'),
      providers: path.resolve(process.cwd(), 'src/js/providers'),
    },
    modules: ['node_modules', 'src'],
    extensions: ['.json', '.js', 'index.js'],
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      output: { comments: false, screw_ie8: true },
      sourceMap: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: { loader: 'babel-loader' },
      },
      { test: /\.html$/, use: 'html-loader' },
    ],
  },
};
