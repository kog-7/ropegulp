var gulp = require("gulp");
let $$ = require("gulp-load-plugins")();
let utils = require("../utils.js");


let run = function(opt) {
  return new Promise(function(resolve, reject) {
    let {
      src,
      dist,
      argument = {},
      browser,
      path,
      lastSend,
      lastEngine,
      type,
      engine,
      allSend
    } = opt;

    let {
      reload
    } = argument;


    let gulpApp = gulp
      .src(src)
      .pipe($$.plumber(function(err){
        reject(JSON.stringify(err));
      }))
      .pipe($$.sass(argument[engine]))
      .pipe($$.sourcemaps.init())
      .pipe($$.autoprefixer());

    run.plugins.forEach(function(plugin, ind) {
      if (plugin in argument) {
        gulpApp = gulpApp.pipe(
          $$[plugin](utils.changeArgument(argument[plugin]))
        );
      }
    });

    gulpApp
      .pipe(gulp.dest(dist))
      .on("end", function() {
        utils.logDone(engine, src, dist);
        resolve();
      })
      .pipe($$.if(reload,browser.reload({stream:true})));
  });
};

run.plugins = ["rename", "csso"];

// run.
module.exports = run;
