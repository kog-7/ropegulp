var gulp = require('gulp');
let $$ = require('gulp-load-plugins')();
let utils=require('../utils.js');
let freemarker=require('freemarker.js');
// let freemarker=require('freemarker2js');
const through = require('through2');


let getFreemarkder=(opt={})=>{
let stream=through.obj(
function(file,enc,cb){
  if (file.isStream()) {
        this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
        return cb();
    }
    let {path}=file;
    let content=file.contents.toString('utf8');
    let {data={},viewRoot}=opt;
    let fm=new freemarker({
      viewRoot:opt.viewRoot
    });
    content=fm.renderSync(opt.index,data);


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
    reload,
    freemarker={}
  } = argument;



  let gulpApp = gulp.src(src)
  .pipe($$.plumber(function(err){
    reject(JSON.stringify(err));
  }))
  .pipe(
    getFreemarkder(freemarker)
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
