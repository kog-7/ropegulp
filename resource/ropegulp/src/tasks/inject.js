var gulp = require('gulp');
let $$ = require('gulp-load-plugins')();
let utils=require('../utils.js');
const fs=require('fs-extra');
const through = require('through2');
const nodepath=require('path');

let inject=(htmlStr,reg)=>()=>{
  let stream=through.obj(
    function(file,enc,cb){
      let ts=this;
      if (file.isStream()) {
        ts.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
        return cb();
      }
      let content=file.contents.toString('utf8');
      let match=reg.exec(htmlStr);
      let startIndex=match.index,lastIndex=reg.lastIndex;
      htmlStr=htmlStr.slice(0,startIndex)+content+htmlStr.slice(lastIndex);
      reg.lastIndex=0;
      content=new Buffer(htmlStr);
      file.contents=Buffer.concat([content]);
      ts.push(file);
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
      reg=/\?ropegulp\?/gm,
      from
    } = argument;

    if(!(typeof from ==='string')){
      reject(`from argument is empty ,error`);
      return;
    }

    fs.readFile(from,'utf8',(err,str)=>{

      if(err){reject(err);}
      else{

        if(!reg.test(str)){
          reject(`${reg} can't test your file`);
          return;
        }
        reg.lastIndex=0;

        let newInject=inject(str,reg);
        let gulpApp = gulp.src(src)
        .pipe($$.plumber(function(err){
          reject(JSON.stringify(err));
        }))
        .pipe(
          newInject()
        );


        run.plugins.forEach(function(plugin, ind) {
          if (plugin in argument) {
            gulpApp = gulpApp.pipe($$[plugin](utils.changeArgument(argument[plugin])));
          }
        });


        gulpApp.pipe(
          gulp.dest(dist)
        )
        .on('end', function() {
          if (reload && browser) {
            browser.reload();
          }
          utils.logDone(engine,src,dist);
          resolve()
        });

      }
    })


  })
};



run.plugins = ['rename'];
module.exports = run;
