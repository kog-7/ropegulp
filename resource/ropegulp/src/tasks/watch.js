var gulp = require('gulp');
let $$ = require('gulp-load-plugins')();
let utils = require('../utils.js');


let run = function(opt) {
return new Promise(function(resolve,reject){
  let { src, dist, argument = {}, browser, path, lastSend, lastEngine, type, engine,allSend} = opt;
  let {
    reload,
    type:tp
  } = argument;
  if (tp === "css") {
    let gulpApp = gulp
    .src(src)
    .pipe($$.plumber(function(err){
      reject(JSON.stringify(err));
    }))
    .pipe(reload({
      stream: true
    }))
    .on('end', function() {
      utils.logDone(engine, src, dist);
    });
  } else {
    reload();
  }
});
};

run.plugins = [];

// run.
module.exports = run;
