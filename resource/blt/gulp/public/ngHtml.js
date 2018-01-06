var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require("gulp-rename");
var cwd = process.cwd();
var gulpif = require('gulp-if');
var path = require("path");
var ngHtml2js = require("gulp-ng-html2js");
var pug = require("gulp-pug");
var parseData = require("../parseData/index.js");
var filterGulp = require("./lib/filter.js");
var handleRename = require("./lib/rename.js");


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

    var moduleName = arg.module;
    var prefix=arg.prefix;
    var jadeOb = arg.jade;
    prefix=prefix?prefix:"";
    var ifJade = jadeOb ? true : jadeOb;
    // var data={};

    var dataObj = parseData(arg.data);

    // if(typeof jadeOb==="object"){
    //   data=jadeOb.data;
    //   data=data?data:{};
    // }
    moduleName = moduleName ? moduleName : "appTemplates";
  var reload = browser?browser.reload:null;
    // var reload=browser.reload;
    var distOb=handleRename(src,dist);
    var dirname = distOb.dirname,
        basename = distOb.basename;



    var config = arg.config;
    try {
        var gulpApp = null;
        gulpApp = gulp.src(src).pipe(gulpif(ifJade, pug({
            data: dataObj
        })));
        gulpApp = filterGulp(gulpApp, arg, ["minHtml"], src, dist);
        gulpApp = gulpApp.pipe(ngHtml2js({
            moduleName: moduleName,
            prefix:prefix
        })).pipe(concat(basename));

        gulpApp = filterGulp(gulpApp, arg, ["remove", "uglify"], src, dist);

        if(typeof cb==="function"){
          cb(gulpApp);
          return;
        }
          gulpApp=filterGulp(gulpApp,arg,["insert"],src,dist);



        gulpApp.pipe(gulp.dest(dirname)).on("end", function() {
            console.log("输出 " + basename + " 到 " + dirname);
            (ifReload&&reload)&&reload();
            if(typeof next==="function"){
              next();
            }
        });
    } catch (e) {
        console.log(e)
    }
};
