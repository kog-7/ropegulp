var gulp = require("gulp");
var rollup = require('gulp-rollup');
var fs = require("fs");
var path = require("path");
var parseData = require("../parseData/index.js");
var filterGulp = require("./lib/filter.js");
var rename = require("gulp-rename");
var handleRename = require("./lib/rename.js");
var sourcemaps = require("gulp-sourcemaps");
let chalk=require("chalk");

const babel = require('gulp-babel');
let builtins=require('rollup-plugin-node-builtins');
let globals=require('rollup-plugin-node-globals');
// var babelDeps = require('gulp-babel-deps');
module.exports = function(src, dist, arg, browser, nowPath, cb, next) {
  arg = arg ? arg : {};
  var ifReload = arg.reload;
  ifReload = ifReload === undefined ? true : ifReload;

  var distOb = handleRename(src, dist);
  var format=arg.format;
  var dirname = distOb.dirname,
    basename = distOb.basename;
  var files = arg.files ? arg.files : src;
var plumber = require('gulp-plumber');
  var reload = browser ? browser.reload : null;
  var dataObj = parseData(arg.data);
format=format?format:'es';
  try {
    //过滤jade内容
    //读取文件
    var gulpApp = gulp.src(files).pipe(plumber());
    gulpApp = gulpApp.pipe(sourcemaps.init()).pipe(rollup({
      input: src,
      format:format,
      treeshake:true,
      external:'node_modules',
      plugins: [
   globals(),
   builtins()
 ],
      allowRealFiles: true//这个属性中重要
    })).pipe(babel({
      presets: ["es2015"]
    }));
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
      ifReload && reload && reload();
      if (typeof next === "function") {
        next();
      }
    });

  } catch (e) {
    console.log(e);
  }
};
