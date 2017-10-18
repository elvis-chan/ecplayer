import gulp from 'gulp';
import sequence from 'gulp-sequence';

gulp.task('copy:providers', () => gulp.src(['src/js/providers/provider.*.js'])
  .pipe(gulp.dest('dist')));

gulp.task('copy', (done) => {
  sequence('copy:providers', done);
});
