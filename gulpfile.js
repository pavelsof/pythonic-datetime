/* ѣ */

var gulp = require('gulp');


// task: process js
// var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('scripts', function() {
	gulp.src('source/*.js')
		.pipe(uglify({
			mangle: false
		}))
		// .pipe(concat('app.js'))
		.pipe(gulp.dest('build'));
});


// task: watch
gulp.task('watch', function() {
	gulp.watch('source/**/*.js', ['scripts']);
});


// task: default
gulp.task('default', function() {
	gulp.start([
		'scripts',
		'watch'
	]);
});
