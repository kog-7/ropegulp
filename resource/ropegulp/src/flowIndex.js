var cwd = process.cwd();
var path = require("path");

var fs = require("fs-extra");
var utils = require("./utils.js");
let data = require("../data.js");
let gulp=require('gulp');
let abilityList = {};


module.exports = function(flow, browser) {
  let watch = flow.watch,
    actions = flow.action;
  watch = utils.setPaths(watch);
  let actionBranch = utils.Branch();


  let collectAction=function(ph,actions,allSend=[],resolve,reject){
    let col=utils.collect();
    let next=this;

    actions.forEach(function(action){
      let {
        engine,
        src,
        dist,
        argument
      } = action;
      src=utils.setPaths(src);
      dist=utils.setPaths(dist);
      // if (!data.isFeature(engine)) {
      //   return;
      // }
      let someRes=abilityList[engine]=utils.requireRes(engine);
      if(someRes===false){
        utils.logError(`${engine} is not exist`);
        return;
      }
      col.get(function(){
        let ts=this;
        let ability = abilityList[engine]({
          src,
          dist,
          engine,
          argument,
          browser,
          path: ph,
          type: "flow/map",
          allSend
        });


        if (ability instanceof Promise) {

          //暂时只是支持Promise写法
          ability
          .then(function(content) {
            allSend.push({
              //所有的发出都一点点的收集
              engine,
              content
            });

            ts(content);
          })
          .catch(function(error) {
            // utils.logError(error);
            reject(error);
          });
        }

      })
    });

    col.setCallback(function(opt){
      resolve(opt);
    }).run();
  };





  let run = (ph = null) => {
    //行为遍历
    let lastEngine = null;
    let allSend = [];

    actions.forEach(function(action, ind) {

     if(Array.isArray(action)){
      actionBranch.get(function(){
        let ts=this;
        return new Promise(function(resolve,reject){
             collectAction(ph,action,allSend,resolve,reject);
        });

      })
      return;
     }


      let {
        engine,
        src,
        dist,
        argument
      } = action;
      src=utils.setPaths(src);
      dist=utils.setPaths(dist);
      if (!data.isFeature(engine)) {
        return;
      }
      let someRes=abilityList[engine]=utils.requireRes(engine);
      if(someRes===false){
        utils.logError(`${engine} is not exist`);
        return;
      }
      //连缀的运行过程
      actionBranch.get(function() {
        let ts = this;

        return new Promise(function(resolve, reject) {
          //包裹一层可以让插件支持更多的方式开发。
          let ability = abilityList[engine]({
            src,
            dist,
            engine,
            argument,
            browser,
            path: ph,
            lastSend: ts,
            lastEngine,
            type: "flow",
            allSend
          });

          if (ability instanceof Promise) {

            //暂时只是支持Promise写法
            ability
              .then(function(content) {
                lastEngine = engine; //设置上次engine.
                allSend.push({
                  //所有的发出都一点点的收集
                  engine,
                  content
                });
                resolve(content);
                // console.log(11);
              })
              .catch(function(error) {
                reject(error);
              });
          }
        });
      });





    });

    actionBranch
      .setError(err => {
        console.log(err);
      })
      .setCallback(res => {
        utils.logDone("flow task id done")
        // console.log("flow task id done");
      })
      .run();
  };



  run();


  if (watch) {
    let watchId = gulp.watch(watch, function(event) {
      run(event.path);
    });
  }


};
