var gulp = require('gulp');
var ngHtml2Js = require("gulp-ng-html2js");
var minifyHtml = require("gulp-minify-html");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var merge = require("gulp-merge");
var del = require("del");

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
    return gulp.src("./partials/*.html")
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(ngHtml2Js({
            moduleName: "MyAwesomePartials",
            prefix: "partials/"
        }))
}

/**
 * Get the source for the main app as a stream
 */
function appSource() {
    return gulp.src(["./js/app.js", "./js/controllers.js"])
}

/**
 * Bundle everything together into /public
 */
gulp.task('default', ['clean'], function() {
    return merge(cacheTemplates(), appSource())
        .pipe(concat("bundle.min.js"))
        // .pipe(uglify()) currently breaks
        .pipe(gulp.dest("./public"));
});