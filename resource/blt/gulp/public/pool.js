var gulp = require("gulp");
var pool = require("gulp-pool");
var fs = require("fs");
var utils=require("../utils.js");
var path=require("path");
var parseData=require("../parseData/index.js");
var rename=require("gulp-rename");
var handleRename=require("./lib/rename.js");
var filterGulp = require("./lib/filter.js");


module.exports=function(src,dist,arg,browser,nowPath,cb,next){
    var reload = browser?browser.reload:null;
  arg=arg?arg:{};
  var ifReload=arg.reload;
  ifReload=ifReload===undefined?true:ifReload;

  var dataObj=parseData(arg.data);
  var distOb=handleRename(src,dist,arg);

  var dirname = distOb.dirname,
      basename = distOb.basename;

  try{
    var gulpApp=null;
    gulpApp=gulp.src(src).pipe(pool({data:dataObj}));
    gulpApp=filterGulp(gulpApp, arg, ["remove","uglify"], src, dist);
    if(typeof cb==="function"){
      cb(gulpApp);
      return;
    }
      gulpApp=filterGulp(gulpApp,arg,["insert"],src,dist);


      // gulpApp=gulpApp.pipe(rename(basename));

      if(basename){
        gulpApp=gulpApp.pipe(rename(basename));
      }
      if(basename===null&&arg.rename){
      gulpApp=gulpApp.pipe(rename(arg.rename));
      }

    gulpApp.pipe(gulp.dest(dirname)).on("end", function() {
          console.log(dirname + " export");
          ifReload&&reload&&reload();
          if(typeof next==="function"){
            next();
          }
      });
    }
    catch(e){
      console.log(e)
    }

}
