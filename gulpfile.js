var g = require('gulp');
var r = require('gulp-rename');
var u = require('gulp-terser');

g.task('minify', async function () {
  g.src(['media-browser.js']).pipe(u()).pipe(r('media-browser.min.js')).pipe(g.dest('./'));
})

g.task('default', g.series(['minify']));
