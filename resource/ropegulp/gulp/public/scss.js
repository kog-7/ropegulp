var gulp = require("gulp");
var sass = require("gulp-sass");
var path = require("path");
var gulpif = require('gulp-if');
var inject = require('gulp-inject-string');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
var parseData = require("../parseData/index.js");
var filterGulp = require("./lib/filter.js");
var handleRename=require("./lib/rename.js");
var toVariable = function(obj) {
    var value = "";
    for (var attr in obj) {
        value += attr + ":" + obj[attr] + ";\n";
    }
    return value + "\n";
};
module.exports = function(src, dist, arg, browser,nowPath,cb,next) {
  var reload = browser?browser.reload:null;

arg=arg?arg:{};
var ifReload=arg.reload;
ifReload=ifReload===false?false:true;


    var dataObj = parseData(arg.data);
    var distOb=handleRename(src,dist,arg);

    var dirname = distOb.dirname,
        basename = distOb.basename;
    var gulpApp = null;
    gulpApp = gulp.src(src).pipe(inject.prepend(toVariable(dataObj))).pipe(sass({}, dataObj).on("error", function(err) {
        console.log(err);
    })).
    pipe(sourcemaps.init()).
    pipe(autoprefixer())
    gulpApp = filterGulp(gulpApp, arg, ["remove"], src, dist);
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
if(ifReload===true){
  gulpApp.pipe(gulp.dest(dirname)).pipe(reload({stream:true})).on("end", function() {

      console.log(dirname + " scss export");
      if(typeof next==="function"){

        next();
      }
  });
}
else{
  gulpApp.pipe(gulp.dest(dirname)).on("end", function() {

      console.log(dirname + " scss export");
      if(typeof next==="function"){

        next();
      }
  });


}


};
