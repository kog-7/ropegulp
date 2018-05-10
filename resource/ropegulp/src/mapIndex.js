let cwd = process.cwd();
let path = require("path");

let fs = require("fs-extra");
//
let utils = require("./utils.js");
let data = require("../data.js");
let gulp=require('gulp');
//能力清单
let abilityList = {};

//
module.exports = function(mapCont, browser,projectName='') {
  // if (!data.isFeature(engine)) {
  //   return;
  // }
  let trueRun=false;
  mapCont.forEach(function(taskContent, ind) {

    if(utils.emptyObject(taskContent)===true){return;}
    let engine=taskContent.engine;
    if(!engine){
    utils.logError(`engine is not exist,pls check your config`);
    return;
    }
    trueRun=true;
    let someRes=abilityList[engine]=utils.requireRes(engine);
    if(someRes===false){
      utils.logError(`${engine} is not exist`);
      return;
    }
    let {
      src,
      dist,
      watch,
      argument
    } = taskContent;
    src = utils.setPaths(src), dist = utils.setPaths(dist), watch = utils.setPaths(watch);

    let run = (ph = null) => {

      abilityList[engine]({
        src,
        dist,
        argument,
        browser,
        path:ph,
        type:'map',
        engine
      });
    }
    run();
    if (watch) {
      let watchId = gulp.watch(watch, function(event) {
        run(event.path);
      });
    }
  });

  if(trueRun===false){
    console.log('no process handle in task');
  }

}
