var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');
let $$ = require('gulp-load-plugins')();
let utils=require('../utils.js');
var buffer = require('vinyl-buffer');
let run = function(opt) {
  return new Promise(function(resolve,reject){

    let { src, dist, argument = {}, browser, path, lastSend, lastEngine, type, engine,allSend} = opt;

    let {
      reload,
      sprite={}
    } = argument;

    let gulpApp = gulp.src(src)
    .pipe($$.plumber(function(err){
      reject(JSON.stringify(err));
    }));

    gulpApp=gulpApp.pipe(
      spritesmith(Object.assign({
        imgName: 'sprite.png',
        cssName: 'sprite.css'
      },sprite))
    ).pipe(buffer());

    run.plugins.forEach(function(plugin, ind) {
      if (plugin in argument) {
        gulpApp = gulpApp.pipe($$[plugin](utils.changeArgument(argument[plugin])));
      }
    })


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

run.plugins = ['imagemin'];

// run.
module.exports = run;
