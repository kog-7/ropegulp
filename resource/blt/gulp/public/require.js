var gulp = require('gulp');
var amdOptimize = require('gulp-requirejs-optimize');
var concat = require('gulp-concat');
var sourcemap = require('gulp-sourcemaps');
var rename = require("gulp-rename");
var cwd = process.cwd();
var gulpif = require('gulp-if');
var path = require("path");
var filterGulp = require("./lib/filter.js");
var handleRename=require("./lib/rename.js");
var getPath = function(url) {
    if (path.isAbsolute(url)) {
        return url;
    } else {
        return path.join(cwd, url);
    }
}
var fs = require("fs");
var utils = require("../utils.js");
var path = require("path");


module.exports = function(src, dist, arg, browser,nowPath,cb,next) {

    arg = arg ? arg : {};
    var ifReload=arg.reload;
    ifReload=ifReload===undefined?true:ifReload;

    var reload = browser?browser.reload:null;
    var distOb=handleRename(src,dist,arg);

    var dirname = distOb.dirname,
        basename = distOb.basename;
    var config = arg.config;



    try {
        var gulpApp = null;
        gulpApp = gulp.src(src)
            .pipe(sourcemap.init())
            .pipe(
                amdOptimize({
                    mainConfigFile: getPath(config),
                    optimize:"none"
                })
            ).on("error",function(e){
              console.log(e);
            });
        gulpApp = filterGulp(gulpApp, arg, ["remove", "uglify"], src, dist);


        if(typeof cb==="function"){
          cb(gulpApp);
          return;
        }
      gulpApp=filterGulp(gulpApp,arg,["insert"],src,dist);


      if(basename){
        gulpApp=gulpApp.pipe(rename(basename));
      }
      if(basename===null&&arg.rename){
      gulpApp=gulpApp.pipe(rename(arg.rename));
      }

        gulpApp.pipe(gulp.dest(dirname)).on("end", function() {
            console.log(dirname + " requirejs export");
            ifReload&&reload&&reload();
            if(typeof next==="function"){
              next();
            }
        });
    } catch (e) {
        console.log(e)
    }
};
