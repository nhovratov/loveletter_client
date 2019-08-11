import gulp from 'gulp';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import cleanCSS from 'gulp-clean-css';
import lec from 'gulp-line-ending-corrector';
import rename from 'gulp-rename';
import postcss from 'gulp-postcss';
import filter from 'gulp-filter';
import webpack from 'webpack';

const devCompiler = webpack(require('./webpack.dev.js'));
const prodCompiler = webpack(require('./webpack.prod.js'));

const tools = require('./tools');

function webpack_build() {
    return tools.compileWebpack([prodCompiler, devCompiler]);
}

function css_theme() {
    return gulp.src('src/scss/theme.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([require('autoprefixer'), require('postcss-flexbugs-fixes')]))
        .pipe(lec())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'))
        .pipe(filter('**/*.css'))
        .pipe(cleanCSS())
        .pipe(rename('theme.min.css'))
        .pipe(gulp.dest('dist/css/'));
}

/**
 * Exported functions are our tasks.
 * Use "gulp --tasks" to get a list.
 **/
export function fonts() {
    return gulp.src('node_modules/@fortawesome/fontawesome-pro/webfonts/*.@(woff|woff2)')
        .pipe(gulp.dest('dist/fonts/fontawesome'));
}

export function fontawesome() {
    return tools.generateFaIconCss();
}

export function watch() {
    gulp.watch([
        'src/scss/*.scss',
        'src/scss/**/*.scss',
    ], css_theme);
    gulp.watch([
        'src/scss/_fa-icons.json',
    ], fontawesome);
    gulp.watch([
        'src/js/*.js',
        'src/js/**/*.js',
    ], webpack_build);
}

export const css = gulp.parallel(css_theme);
export const build = gulp.parallel(
    gulp.series(gulp.parallel(fonts, fontawesome), css),
    webpack_build
);
export default build;

// aliase
module.exports['webpack:build'] = webpack_build;
module.exports['css:theme'] = css_theme;
