
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
    //参数判断
    arg.includes('open')&&(ifOpen=true);
    let browser=config.browser;
    if(ifOpen===true){
      browser.open=true;
    }
    else{
      browser.open=false;
    }
    return browser;
  },
  run: function(configObj, configUrl="") {
    let task=data.get("task");
    if(!this.check(task,configObj,configUrl)){return false;}
    let config=configObj[task];
    let browser = browserSync.create();
    let {map,flow,browser:browserConfig,exec=[]}=config;

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

    var runExec=function(){
      exec.forEach((obj,ind)=>{
        let baseDir=obj.dir;
        baseDir=baseDir?baseDir:utils.cwd;
        execa.shell(`${obj.cmd}`,{
          cwd:baseDir
        }).then(()=>{
          console.log(chalk.blue(`${obj.cmd} is begin`));
        })
        .catch((err)=>{
          console.log(chalk.blue(err));
        });
      });
    };


    if(typeof browserConfig==='object'){
      let {port}=browserConfig;
      if(typeof port==='number'){

        browser.init(this.getBrowserConfig(config),function(){
          runExec();
          utils.logServer(port);
        });
      }
    }
    else{
      runExec();
    }

  }
};
