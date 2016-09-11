var gulp = require('gulp');
var ngHtml2Js = require('gulp-ng-html2js');
var minifyHtml = require('gulp-minify-html');
var merge = require('gulp-merge');
var del = require('del');

/**
 * Clean up the public directory before re-building
 */
gulp.task('clean', function() {
    del(['public'], {
        dot: true
    });
});

/**
 * Generate a templateCache friendly version of Angular partials
 */
function cacheTemplates() {
    return gulp.src('./partials/*.html')
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(ngHtml2Js({
            moduleName: 'appPartials',
            prefix: 'partials/'
        }))
}