import gulp from 'gulp';
import connect from 'gulp-connect';

gulp.task('font', () => gulp.src('src/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
  .pipe(connect.reload()));
