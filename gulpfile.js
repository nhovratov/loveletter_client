// node
var extend = require('extend');

// gulp
var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var postcss = require('gulp-postcss');
var sequence = require('gulp-sequence');
var lec = require('gulp-line-ending-corrector');

// -----
// TASKS

gulp.task('theme-css', function () {
    return gulp.src('src/scss/theme.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([require('autoprefixer'), require('postcss-flexbugs-fixes')]))
        .pipe(lec())
        .pipe(gulp.dest('dist/css/'))
        .pipe(cleanCSS())
        .pipe(rename("theme.min.css"))
        .pipe(gulp.dest('dist/css/'))
});

gulp.task('js', function () {
    return gulp.src([
        'node_modules/vue/dist/vue.js',
        'node_modules/js-cookie/src/js.cookie.js'
    ])
        .pipe(lec())
        .pipe(gulp.dest('dist/js/libs'));
});


gulp.task('build', sequence(['js', 'theme-css']));

gulp.task('watch', function () {
    gulp.watch([
        'src/scss/**/*.scss',
        'src/scss/*.scss'
    ], ['theme-css']);
});

gulp.task('default', ['watch']);
