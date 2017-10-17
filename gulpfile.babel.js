import gulp from 'gulp';
import requireDir from 'require-dir';

import sequence from 'gulp-sequence';
import connect from 'gulp-connect';

gulp.task('server', () => connect.server({
  root: 'dist',
  livereload: true,
  port: 8080,
}));

requireDir('./tasks', { recurse: true });

gulp.task('watch', () => {
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/js/**/*.js', ['lint']);
  gulp.watch('src/scss/**/*.scss', ['style']);
  gulp.watch('src/images/**/*', ['image']);
});

gulp.task('build', (done) => {
  sequence('clean', ['html', 'script', 'style', 'image'], done);
});

gulp.task('default', (done) => {
  sequence('server', 'watch', 'lint', 'build', done);
});
