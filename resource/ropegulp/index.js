const gulp = require('gulp');
// var plugins=require('gulp-load-plugins')();
const cwd = process.cwd();
let path = require("path");
let chalk=require("chalk");
//工具函数
let utils = require("./src/utils.js");
let data=require("./data.js");
//能力载入
let mapIndex = require("./src/mapIndex.js");
let flowIndex = require("./src/flowIndex.js");
const browserSync = require("browser-sync");
const execa=require('execa');
//
module.exports = {
  check(task,configObj,configUrl){
    // console.log(configObj,task);
      if(configObj&&configObj[task]){
          return true;
      }
      else{
        utils.logError(task);
          return false;
      }
  },
  getBrowserConfig(config){//args为是否open等内容
    let arg=data.get("arg");//arg表示命令行的运行参数
    let ifOpen=false;
    let staticDir=config.staticDir;
    let staticFile=config.staticFile;
    staticDir = staticDir ? staticDir : "./";
    staticFile = staticFile ? staticFile : "index.html";
    //参数判断
    arg.includes('open')&&(ifOpen=true);
    return ({ //启动代理
      port: config.port, //应用打开的端口
      open: ifOpen,
      server: {
        baseDir:staticDir,
        index:staticFile
      }
    });
  },
  gulp: function(configObj, configUrl="") {
    let task=data.get("task");
    if(!this.check(task,configObj,configUrl)){return false;}
    let config=configObj[task];
    let browser =null;
    let {map,flow,port,exec=[]}=config;
    if(port){
        browser = browserSync.create();
        browser.init(this.getBrowserConfig(config));
        utils.logServer(port);
    }
    //具体功能运行
    let mapWatchIds={},flowWatchIds={};

    if(map){

      if(Array.isArray(map)){
        mapIndex(map,browser);
      }
      else if(typeof map==='object'){
        let keys=Object.keys(map);keys=keys?keys:[];
        for(let key of keys){
          mapIndex(map[key],browser,key);
        }
      }
    }
    if(flow){
      flowIndex(flow,browser);
    }
    utils.logTask(task);
    //暂时不支持监听配置文件

    exec.forEach((obj,ind)=>{
        execa.shell(`${obj.cmd}`,{
          cwd:obj.dir
        }).then(()=>{
          console.log(chalk.blue(`${obj.cmd} is begin`));
        })
        .catch((err)=>{
          console.log(chalk.blue(err));
        });

    })

  }
};
