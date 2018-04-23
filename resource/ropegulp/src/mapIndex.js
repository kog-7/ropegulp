let cwd = process.cwd();
let path = require("path");
let gulp = require("gulp");
let fs = require("fs-extra");
//
let utils = require("./utils.js");
let data = require("../data.js");

//能力清单
let abilityList = {};




//
module.exports = function(mapCont, browser,projectName='') {
  // if (!data.isFeature(engine)) {
  //   return;
  // }
  mapCont.forEach(function(taskContent, ind) {
    let engine=taskContent.engine;
    if(!engine){
      utils.logError(`engine is not exist,pls check`);
    return;
    }
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
}
