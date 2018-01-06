var gulp = require('gulp');
// var plugins=require('gulp-load-plugins')();
var cwd = process.cwd();
var path = require("path");

//工具函数
var utils = require("./gulp/utils.js");

//能力载入
var ability = require("./gulp/mapIndex.js");

var flowAbility = require("./gulp/flowIndex.js");

let args=process.argv;
let taskName=args[2];
let taskArg=args.slice(3);
let ifOpen=(taskArg.indexOf("open")!==-1)?true:false;
//配置表载入

var getPath = function(url) {
  if (typeof url !== "string") {
    return url;
  }
  if (path.isAbsolute(url)) {
    return url;
  } else {
    return path.join(cwd, url);
  }
}


//初始化
var handMap = function(browser, map, watchIds) { //做src判别
  var arr = null;
  if (!map) {
    return;
  }
  for (var attr in map) {
    arr = map[attr];
    // arr是一类任务的集合
    ability(attr, arr, browser, watchIds);
  }
}


var handFlow = function(browser, flow, watchIds) {
  if (!flow) {
    return;
  }
  var ob = null;
  flowAbility(flow, browser, watchIds);
};

module.exports = {
  gulp: function(configObj, configUrl) {

    if (configUrl) {
      configUrl = getPath(configUrl);
    }
    if (!configObj) {
      console.log("no ropegulpfile");
      return;
    }
    let config=configObj[taskName];
    if(!config){  console.log(`no task ${taskName} in your ropegulpfile`);return;}
      var browser = null;

      (function(attr, config) {
        // gulp.task(attr, function() {
          if (config.port) {
            browser = require("browser-sync").create(); //当前服务器
            var open = config.open === false ? false : true;
            var serverDir = config.staticDir;
            var serverFile = config.staticFile;
            serverDir = serverDir ? serverDir : "./";
            serverFile = serverFile ? serverFile : "index.html";

            browser.init({ //启动代理
              port: config.port, //应用打开的端口
              open: ifOpen,
              server: {
                baseDir: serverDir,
                index: serverFile
              }
            });
            console.log(config.port+" is listened");
          }

          var map = config.map;
          var flow = config.flow;
          var mapWatchIds = {
            collect: []
          };
          var flowWatchIds = {
            collect: []
          };
          if (map) {
            handMap(browser, map, mapWatchIds);
          }
          if (flow) {
            handFlow(browser, flow, flowWatchIds);
          }

          if (configUrl) {
            var watch = gulp.watch(configUrl, function() { //config文件变化，全部载入更新一次。
              mapWatchIds.collect.forEach(function(obj, ind) {
                if (obj) {
                  obj.tf = 1;
                  if (obj.watch) {
                    obj.watch.remove();
                  }
                }
              });
              mapWatchIds.collect = [];
              flowWatchIds.collect.forEach(function(obj, ind) {
                // console.log(obj,".....");
                if (obj) {
                  obj.tf = 1;
                  if (obj.watch) {
                    obj.watch.remove();
                  }
                }
              });
              flowWatchIds.collect = [];
              console.log("config.js is chanaged");
              delete require.cache[require.resolve(configUrl)];
              var config = require(configUrl)[attr]; //重新加载配置
              handMap(browser, config.map, mapWatchIds); //执行文件处理
              handFlow(browser, config.flow, flowWatchIds);
            });

          }
        // });

      })(taskName, config)

      console.log(`task ${taskName} in running`);


  }
};
