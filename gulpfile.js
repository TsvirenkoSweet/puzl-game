var gulp         = require('gulp'),
		sass         = require('gulp-sass'),
		autoprefixer = require('gulp-autoprefixer'),
		cleanCSS     = require('gulp-clean-css'),
		rename       = require('gulp-rename'),
		browserSync  = require('browser-sync').create(),
		concat       = require('gulp-concat'),
		uglify       = require('gulp-uglify');

gulp.task('browser-sync', ['styles', 'scripts'], function() {
		browserSync.init({
				server: {
						baseDir: "./app"
				},
				notify: false
		});
});



gulp.task('styles', function () {
	return gulp.src('sass/*.sass')
	.pipe(sass({
		includePaths: require('node-bourbon').includePaths
	}).on('error', sass.logError))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
	.pipe(cleanCSS())
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream());
});


gulp.task('scripts', function() {
	return gulp.src([
		'./app/js/instanse/*.js'
		])
		.pipe(concat('libs.min.js'))
		// .pipe(uglify()) // Minify common.js
		.pipe(gulp.dest('./app/js/'));
});



gulp.task('watch', function () {
	gulp.watch('sass/*.sass', ['styles']);
	gulp.watch('app/js/instanse/*.js', ['scripts']);
	gulp.watch('app/js/instanse/*.js').on("change", browserSync.reload);
	gulp.watch('app/index.html').on('change', browserSync.reload);
});

gulp.task('default', ['browser-sync', 'watch']);
