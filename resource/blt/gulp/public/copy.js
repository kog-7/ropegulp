var gulp = require('gulp');
var rename = require("gulp-rename");
var cwd = process.cwd();
var filterGulp = require("./lib/filter.js");
var rename = require("gulp-rename");
var colors=require("colors");
var getPath = function(url) {
    if (path.isAbsolute(url)) {
        return url;
    } else {
        return path.join(cwd, url);
    }
}

var fs = require("fs-extra");
var utils = require("../utils.js");
var path = require("path");
// var  through = require('through2');

module.exports = function(src, dist, arg, browser,nowPath,cb,next) {
    src = getPath(src), dist = getPath(dist);
    arg = arg ? arg : {};
    var ifReload=arg.reload;
    ifReload=ifReload===undefined?true:ifReload;
var reload = browser?browser.reload:null;
    try {

        fs.stat(src,function(err,stats){

          if(!err&&stats.isDirectory()){
          fs.copy(src,dist,function(){
            console.log(src+" copy is over");
          });
          return;
}

          var outSrc=src;
          var distFile="",distDir=dist;

          var basename=path.basename(dist);
          if(basename.indexOf('.')!==-1){
            distFile=basename;
            distDir=path.dirname(dist);
          }

          if(stats&&stats.isDirectory()){
            outSrc=path.join(src, "**/*");
          }
          else if(stats&&stats.isFile()){
            // distFile=path.basename(dist);
            // distDir=path.dirname(dist);
          }

          var gulpApp = gulp.src(outSrc);
          filterGulp(gulpApp, arg, ["uglify", "minImage"], src, distDir, {
              uglify: function(tf) {
                  if (tf !== true) {
                      return false;
                  }
                  return function(a, b) {
                      var ph = a.path;
                      var prefix = ph.slice(ph.lastIndexOf("."));
                      if (prefix.indexOf("js") !== -1 && uglifyOb) {
                          return true;
                      } else {
                          return false;
                      }
                  }
              },
              minImage: function(tf) {
                  if (tf !== true) {
                      return false;
                  }
                  return function(a, b) {
                      var ph = a.path;
                      var prefix = ph.slice(ph.lastIndexOf("."));
                      if (prefix.indexOf("js") !== -1 && imageminOb) {
                          return true;
                      } else {
                          return false;
                      }
                  };
              }
          });

          if(distFile){
            gulpApp=gulpApp.pipe(rename(distFile));
          }
// console.log(colors.green(distDir,distFile));



          gulpApp.pipe(gulp.dest(distDir)).on("end", function() {
              console.log(distDir + " copy export");
              if(typeof next==="function"){

                next();
              }
              else{
                    (reload&&ifReload)&&reload();
              }

          });

        });






    } catch (e) {
        console.log(e)
    }
};
