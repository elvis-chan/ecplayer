import gulp from 'gulp';
import clean from 'gulp-clean';

const cleanTask = done => gulp.src(['dist/*'], { read: false }).pipe(clean());

gulp.task('clean', cleanTask);

export default cleanTask;
