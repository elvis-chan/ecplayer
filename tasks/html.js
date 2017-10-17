import gulp from 'gulp';
import connect from 'gulp-connect';
import htmlmin from 'gulp-htmlmin';

gulp.task('html', () => gulp.src('src/*.html')
  .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
  .pipe(gulp.dest('dist'))
  .pipe(connect.reload()));
