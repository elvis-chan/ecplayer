import gulp from 'gulp';
import eslint from 'gulp-eslint';

gulp.task('lint', () => gulp.src(['src/js/**/*.js'])
  .pipe(eslint())
  .pipe(eslint.format()));
