import gulp from 'gulp';
import connect from 'gulp-connect';
import rename from 'gulp-rename';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';

import pkg from '../package.json';

gulp.task('style', () => gulp.src('src/scss/**/*.scss')
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(sass({ outputStyle: 'compressed' })
    .on('error', sass.logError))
  .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
  .pipe(rename(`${pkg.name}.css`))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('dist'))
  .pipe(connect.reload()));
