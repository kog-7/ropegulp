const path = require("path");
const chalk = require("chalk");
const cwd=process.cwd();
let Branch=require("./utils/branch.js");
let collect=require("./utils/collect.js");
var toArray = function(arg) {
  return Array.prototype.slice.call(arg, 0);
}

var join = function() { //可以把参数里面所有的路径都加起来
  var arr = toArray(arguments),
    ph = "";
  arr.forEach(function(url) {
    ph = path.join(ph, url);
  });
  return ph;
};

var typeHim = function(dm) {
  if (dm === undefined) {
    return "undefined";
  }
  if (dm === null) {
    return "null";
  }
  var tp = typeof dm;
  if (tp === "string" || tp === "number" || tp === "function") {
    return tp;
  }
  tp = Object.prototype.toString.call(dm);
  if (tp.indexOf("rray") !== -1 || tp.indexOf("rguments") !== -1) {
    return "array";
  } else if (tp.indexOf("ragment") !== -1) {
    return "fragment"
  } else if (tp.indexOf("odeList") !== -1) {
    return "nodelist";
  } else if (tp.indexOf("lement") !== -1) {
    return "node";
  } else if (tp.indexOf("egExp") !== -1) {
    return "regexp";
  } else if (tp.indexOf("bject") !== -1) {
    return "object";
  } else {
    return false;
  }
};

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

var setPaths = function(arr) { //需要后面优化
  if (!arr) {
    return;
  }
  if (typeof arr === "string") {
    return getPath(arr);
  }
  if (Array.isArray(arr)) {
    arr.forEach(function(str, ind) {
      arr[ind] = getPath(str);
    });
    if(arr.length===0){arr="";}
    return arr;
  }
  if(typeof arr==="object"){
    for(let key of Object.keys(arr)){
      arr[key]=getPath(arr[key]);
    }
    return arr;
  }

};


var getFileName = function(file) {
  var ind = file.lastIndexOf("/");
  return file.slice(ind + 1);
};

var miniExtend = function(aob, ob) {
  var i = null;
  for (i in ob) {
    if (!(i in aob)) {
      aob[i] = ob[i];
    }
  }
  return aob;
}
var coverExtend = function(aob, ob) {
  var i = null;
  for (i in ob) {
    aob[i] = ob[i];
  }
  return aob;
}




let ckLog = function(msg, color = 'white') {
  console.log(chalk[color](msg));
};

//日志打印
let logError = function(msg) {
  // if(typeof fun!=='function'){ckLog(msg);return;}
  ckLog(`${msg}:发生错误`, 'red');
}
let logServer = function(port) {
  ckLog(`${port}:is opened`, 'green');
};
let logTask = function(task) {
  ckLog(`task ${task} is run.`);
}
let logDone=function(engine,src,dist){
  ckLog(`${engine}:from ${src} to ${dist}`,'green');
}


let changeArgument=(val)=>{
 return val===true?undefined:val;
}


let getDay=()=>{
let date=new Date();
return date.getYear()+'_'+(date.getMonth())+"_"+date.getDay()+"_"+date.getHours()+"_"+date.getMinutes()+"_"+date.getSeconds();
};

let undefinedToObject=(val)=>{
  if(!val&&val!==0){
    return {}
  }
  else{
    return val;
  }
};
let basePath='tasks';

let customPath=path.join(cwd,'ropegulp-custom-task');


let requireRes=(engine)=>{
  let out=null;
  try{
    out=require('./'+path.join(basePath,engine));
  }
  catch(e){
    try{
      out=require(path.join(customPath,engine));
    }
    catch(e){
      out=false;
    }
  }

return out;
};

module.exports = {
  requireRes,
  undefinedToObject,
  getDay,
  changeArgument,
  logError,
  logServer,
  logDone,
  logTask,
  toArray,
  join,
  getFileName,
  miniExtend,
  coverExtend,
  // branch,
  typeHim,
  getPath,
  setPaths,
  Branch,
  basePath,
  cwd,
  collect
}
