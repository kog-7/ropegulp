var gulp = require("gulp");
var jade = require("gulp-jade");
var fs = require("fs");
var path = require("path");
var parseData = require("../parseData/index.js");
var filterGulp = require("./lib/filter.js");
var rename = require("gulp-rename");
var handleRename = require("./lib/rename.js");
module.exports = function(src, dist, arg, browser, nowPath, cb,next) {
arg=arg?arg:{};
var ifReload=arg.reload;
ifReload=ifReload===undefined?true:ifReload;

  var distOb=handleRename(src,dist);

  var dirname = distOb.dirname,
      basename = distOb.basename;


    var reload = browser ? browser.reload : null;
    var dataObj = parseData(arg.data);

    try {
        //过滤jade内容
        //读取文件
        var gulpApp = gulp.src(src);
        gulpApp = gulpApp.pipe(jade({
            data: dataObj
        })).on("error", function(e) {
            console.log(e);
        });
        gulpApp = filterGulp(gulpApp, arg, ["remove", "minHtml"], src, dist);

        if (typeof cb === "function") {
            cb(gulpApp);
            return;
        }
        gulpApp = filterGulp(gulpApp, arg, ["insert"], src, dist);


        if(basename){
          gulpApp=gulpApp.pipe(rename(basename));
        }
        if(basename===null&&arg.rename){
        gulpApp=gulpApp.pipe(rename(arg.rename));
        }


        gulpApp.pipe(gulp.dest(dirname)).on("end", function() {
            console.log("输出 " + src + " 到 " + dist);
            ifReload&&reload&& reload();
            if(typeof next==="function"){
              next();
            }
        });

    } catch (e) {
        console.log(e);
    }
};
