var gulp = require("gulp");
var babel = require("gulp-babel"),
  es2015 = require("babel-preset-es2015");
var browserify = require("browserify");
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var hmr = require('browserify-hmr');
var watchify = require("watchify");
var fs = require("fs-extra");
var path = require("path");
var sourcemaps = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var gulpif = require('gulp-if');
let gutil=require("gulp-util");
var handleRename = require("./lib/rename.js");
var plumber = require('gulp-plumber');
var filterGulp = require("./lib/filter.js");
var gbrowserify = require('gulp-browserify');
module.exports = function(src, dist, arg, browser, nowPath, cb, next) {
  arg = arg ? arg : {};
  var ifReload = arg.reload;
  ifReload = ifReload === undefined ? true : ifReload;

  var distOb = handleRename(src, dist, arg);

  var dirname = distOb.dirname,
    basename = distOb.basename;


  var reload = browser ? browser.reload : null;
  try {
    // var gulpApp = gulp.src('')

  var gulpApp= browserify({
        entries: src,
        debug: true
      })
      // .on('error', gutil.beep)
      .transform("babelify", {
        presets: ["es2015"]
      })
      .bundle()
      .pipe(plumber())
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init());

    gulpApp = filterGulp(gulpApp, arg, ["remove", "uglify"], src, dist);

    if (typeof cb === "function") {
      cb(gulpApp);
      return;
    }
    gulpApp = filterGulp(gulpApp, arg, ["insert"], src, dist);



    if (basename) {
      gulpApp = gulpApp.pipe(rename(basename));
    }
    if (basename === null && arg.rename) {
      gulpApp = gulpApp.pipe(rename(arg.rename));
    }



    gulpApp.pipe(gulp.dest(dirname)).on("end", function() {
      console.log("输出 " + src + " 到 " + dist);
      (reload && ifReload) && reload();

      if (typeof next === "function") {
        next();
      }

    });
  } catch (e) {
    console.log(e)
  }
}
