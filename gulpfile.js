var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var concat = require('gulp-concat');

gulp.task('sass', function () {
  return sass('styles/sass/main.scss')
    .on('error', sass.logError)
    .pipe(gulp.dest('styles/css'));
});


gulp.task('scripts', function() {
  return gulp.src([
      'libs/jquery/jquery-2.1.1.min.js',
      'libs/materialize/js/materialize.min.js',
      'scripts/scripts.js'
  ])
    .pipe(concat('build.js'))
    .pipe(gulp.dest('scripts'));
});
