var gulp = require('gulp');
let $$ = require('gulp-load-plugins')();
let utils=require('../utils.js');
var tsify = require("tsify");
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');


let run = function(opt) {
return new Promise(function(resolve,reject){
  let { src, dist, argument = {}, browser, path, lastSend, lastEngine, type, engine,allSend} = opt;
  let {
    reload
  } = argument;

  if(typeof src==="string"){src=[src];}
  let gulpApp=browserify({
    basedir:".",
    debug:true,
    entries:src,
    cache:{},
    packageCache:{}
  })
  .plugin(tsify)
  .transform('babelify',{
    presets:['es2015'],
    extensions:['.ts']
  })
  .bundle()
  .pipe($$.plumber(function(err){
    reject(JSON.stringify(err));
  }))
  .pipe(source())
  .pipe(buffer())

  run.plugins.forEach(function(plugin, ind) {
    if (plugin in argument) {
      gulpApp = gulpApp.pipe($$[plugin](utils.changeArgument(argument[plugin])));
    }
  });

  gulpApp
    .pipe(gulp.dest(dist))
    .on('end', function() {
      if (reload && browser) {
        browser.reload();
      }
      utils.logDone(engine,src,dist);
      resolve()
    });
})
};

run.plugins = ['uglify', 'rename'];

// run.
module.exports = run;
