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
      .pipe($$.concat(utils.changeArgument(argument[engine]))); //本质插件



    run.plugins.forEach(function(plugin, ind) {
      if (plugin in argument) {
        gulpApp = gulpApp.pipe(
          $$[plugin](utils.changeArgument(argument[plugin]))
        );
      }
    });



    gulpApp.pipe(gulp.dest(dist)).on("end", function() {
      if (reload && browser) {
        browser.reload();
      }
      utils.logDone(engine, src, dist);
      resolve();
    });
  });
};

run.plugins = ["uglify", "rename"];

// run.
module.exports = run;
