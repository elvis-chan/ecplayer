import gulp from 'gulp';
import image from 'gulp-image';

gulp.task('image', () => gulp.src('src/images/**/*')
  .pipe(image())
  .pipe(gulp.dest('dist/images')));
