import gulp from 'gulp';
import sequence from 'gulp-sequence';
import rename from 'gulp-rename';

gulp.task('copy:providers', () => gulp.src(['src/js/providers/plugins/*.js'])
  .pipe(rename({ prefix: 'provider.' }))
  .pipe(gulp.dest('dist')));

gulp.task('copy', (done) => {
  sequence('copy:providers', done);
});
