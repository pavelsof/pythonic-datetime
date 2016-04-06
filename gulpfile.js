/* ѣ */

var gulp = require('gulp');
var uglify = require('gulp-uglify');

gulp.task('scripts', function() {
	gulp.src('source/datetime.js')
		.pipe(uglify({
			mangle: true
		}))
		.pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
	gulp.watch('source/datetime.js', ['scripts']);
});

gulp.task('default', function() {
	gulp.start([
		'scripts',
		'watch'
	]);
});
