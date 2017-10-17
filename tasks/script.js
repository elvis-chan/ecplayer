import gulp from 'gulp';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';

import connect from 'gulp-connect';

import config from '../webpack.config.js';

gulp.task('script', () => gulp.src('src/js/app.js')
  .pipe(webpackStream(config, webpack))
  .pipe(gulp.dest('dist'))
  .pipe(connect.reload()));
