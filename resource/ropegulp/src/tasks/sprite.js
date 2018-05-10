var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');
let $$ = require('gulp-load-plugins')();
let utils=require('../utils.js');
var buffer = require('vinyl-buffer');



var cssTemplate=function(scale=1,prefix='sprite'){
  return function(data){
    let arr=[];
    let {spritesheet}=data;
    let {px,image}=spritesheet;
    let {width,height}=px;
    let allWidth=utils.multiPx(width,scale);
    let allHeight=utils.multiPx(height,scale);

    data.sprites.forEach(function(spa,ind){

      let px=spa.px;
      let {width,height,offset_x,offset_y}=px;

      width=utils.multiPx(width,scale);
      height=utils.multiPx(height,scale);
      offset_x=utils.multiPx(offset_x,scale);
      offset_y=utils.multiPx(offset_y,scale);
      arr.push(`
        .${prefix}-${spa.name}{
          width:${width};
          height:${height};
          background-position: ${offset_x} ${offset_y};
          background-size: ${allWidth} ${allHeight};
          background-image: url(${spa.image});
        }
        `);
      });
      return arr.join('');
    }
  };



  let run = function(opt) {
    return new Promise(function(resolve,reject){

      let { src, dist, argument = {}, browser, path, lastSend, lastEngine, type, engine,allSend} = opt;

      let {
        reload,
        sprite={}
      } = argument;
      let {scale,prefix,imgName='sprite.png',cssName='sprite.css'}=sprite;

      let gulpApp = gulp.src(src)
      .pipe($$.plumber(function(err){
        reject(JSON.stringify(err));
      }));


      let defaultObj={
        imgName,
        cssName,
        cssTemplate:cssTemplate(scale,prefix)
      };


      gulpApp=gulpApp.pipe(
        spritesmith(Object.assign(defaultObj,sprite))
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
