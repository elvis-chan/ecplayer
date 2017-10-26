import gulp from 'gulp';

gulp.task('font', () => gulp.src('src/fonts/**/*')
  .pipe(gulp.dest('dist/fonts')));
