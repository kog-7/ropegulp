const crypto=require('crypto');
const md5=crypto.createHash('md5');
const chalk=require("chalk");
const nodepath=require("path");
const fs=require("fs-extra");
const cwd=process.cwd();


var loop=(function(){
var isFun=function(f){return (typeof f)==="function";},toArray=function(){
    return Array.prototype.slice.call(arguments[0], 0);
};
    var bra=function(){//id从零开始起
    if(!(this instanceof loop)){return new loop();}
    this._functions={},this._id=0,this._nextId=0;//单function，临时链路使用
    };
    bra.prototype={
        _middleFun:function(f,nextId){
            var funs=this._functions;
            return function(){
                var nextFun=funs[nextId];
                //这里为可能的最后运行，可以清除缓存
                if(!isFun(nextFun)){nextFun=function(){};}//表示结束function
                f.apply(nextFun,toArray(arguments));
            }
        },
        _wrap:function(f){//生成包裹函数，设置当前预售id
            //如下可以改成名字互动
            var nowId=this._id,nextId=this._id+=1;
            //注入当前的f
            this._functions[nowId]=this._middleFun(f,nextId);
        },
        get:function(f){
            if(!isFun(f))return false;
            this._wrap(f);
            return this;
        },
        run:function(){
            this._functions[0].apply(null,toArray(arguments));
            return this;
        }
    }
return bra;
})()


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

let splitPath=(str)=>{
  let ind=str.lastIndexOf(".");
  return [str.slice(0,ind),str.slice(ind)];
}

let parseFormat=(cont,lastCont)=>{//
if(typeof cont==="string"){return cont;}
else if(typeof cont==="function"){
return cont(lastCont)
}
else{return "";}
}

module.exports={
md5(str){
return md5.update(str).digest('hex');
},
logError,
splitPath,
parseFormat,
loop,
getPath(url) {
  if (typeof url !== "string") {
    return url;
  }
  if (nodepath.isAbsolute(url)) {
    return url;
  } else {
    return nodepath.join(cwd, url);
  }
},
relativePath(url){
  return nodepath.relative(cwd,url);
},
normalizeRelativePath(url){
  return url.split(nodepath.sep).join('/');
},
versionPath(path,format,lastVersion){//format
  let spath=splitPath(path);
  spath.splice(1,0,parseFormat(format,lastVersion));//生成新的版本
 return spath.join("");//更换文件名字

},
ensureReadFile(url,cb=()=>{},defaultStr=""){//cb(err,)

fs.stat(url,(err,stats)=>{

  if(err||!stats.isFile()){//没有文件的相关情况
    fs.ensureFile(url)
    .then(function(){

      fs.writeFile(url,defaultStr,'utf8',(err)=>{
        if(err){cb(err);}
        else{
          cb(null,defaultStr);
        }
      });
    })
    .catch(function(err){
      cb(err);
    })
  }
  else{
    fs.readFile(url,'utf8',(err,str)=>{
      if(err){cb(err)}
      else{cb(null,str);}
    })
  }
});

}


}
