import webpack from 'webpack';
import path from 'path';

import pkg from './package.json';

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
    filename: `${pkg.name}.js`,
  },
  resolve: {
    alias: {
      templates: path.resolve(process.cwd(), 'src/templates'),
      api: path.resolve(process.cwd(), 'src/js/api'),
      utils: path.resolve(process.cwd(), 'src/js/utils'),
      views: path.resolve(process.cwd(), 'src/js/views'),
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
        use: { loader: 'babel-loader', options: { presets: ['env'] } },
      },
      { test: /\.html$/, use: 'html-loader' },
    ],
  },
};
