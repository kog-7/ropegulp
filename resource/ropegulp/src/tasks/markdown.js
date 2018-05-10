var gulp = require('gulp');
let $$ = require('gulp-load-plugins')();
let utils=require('../utils.js');
let markdown=require('marked');
const through = require('through2');





let gulpMarkdown=()=>{
let stream=through.obj(
function(file,enc,cb){
  if (file.isStream()) {
        this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
        return cb();
    }
    let path=file.path;


    let content=file.contents.toString('utf8');
    content=markdown(content);
    content=new Buffer(content);
    file.contents=Buffer.concat([content]);
    this.push(file);
    cb(null,file);
}
)
return stream;
}


let run = function(opt) {
return new Promise(function(resolve,reject){
  let { src, dist, argument = {}, browser, path, lastSend, lastEngine, type, engine,allSend} = opt;
  let {
    reload
  } = argument;



  let gulpApp = gulp.src(src)
  .pipe($$.plumber(function(err){
    reject(JSON.stringify(err));
  }))
  .pipe(
    gulpMarkdown()
  )
  .pipe($$.rename({
    extname: ".html"
  }))
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

run.plugins = ['htmlmin','rename'];

// run.
module.exports = run;
