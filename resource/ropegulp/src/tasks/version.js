var gulp = require('gulp');
let $$ = require('gulp-load-plugins')();
let utils=require('../utils.js');
let gulpV=require("../customGulp/gulp-v/index.js");




let run = function(opt) {


return new Promise(function(resolve,reject){
  let { src, dist, argument = {}, browser, path, lastSend, lastEngine, type, engine,allSend} = opt;
  let {
    reload
  } = argument;

  let {asset:assetSrc,template:templateSrc}=src;

let coreArg=argument[engine];
coreArg=coreArg?coreArg:{};
let {configDir=null,cacheRemove=true,cacheDir=null,format=null}=coreArg;

let assetRun=function(next){

  let gulpApp = gulp.src(assetSrc)
  .pipe($$.plumber(function(err){
    reject(JSON.stringify(err));
  }))
  .pipe(gulpV.remove({
    configDir,
    cacheRemove
  }))
  .pipe(gulpV.asset({
    configDir,
    format
  }))


  run.plugins.forEach(function(plugin, ind) {
    if (plugin in argument) {
      gulpApp = gulpApp.pipe($$[plugin](utils.changeArgument(argument[plugin])));
    }
  });


  gulpApp
    .pipe(gulp.dest(dist))
    .pipe(gulpV.configV())
    .on('finish', function() {
      utils.logDone(engine+":asset",JSON.stringify(src),dist);
      next();
    });
}



let templateRun=function(){

  let gulpApp = gulp.src(templateSrc)
  .pipe($$.plumber(function(err){
    reject(err);
  }))
  .pipe(gulpV.template({
    configDir
  }))

  run.plugins.forEach(function(plugin, ind) {
    if (plugin in argument) {
      gulpApp = gulpApp.pipe($$[plugin](utils.changeArgument(argument[plugin])));
    }
  });

  gulpApp
    .pipe(gulp.dest(dist))
    .on('finish', function() {
      if (reload && browser) {
        browser.reload();
      }
      utils.logDone(engine+":template",JSON.stringify(src),dist);
      resolve();
    });
};


assetRun(templateRun)

});

};

run.plugins = ['uglify', 'rename'];

// run.
module.exports = run;
