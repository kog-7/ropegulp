var gulp = require('gulp');
let utils=require('./src/utils.js');
let glob=require('glob');
let fs=require("fs-extra");
const through = require('through2');
// const rename=require('gulp-rename');
const nodepath=require("path");



let copyOld=(src,aim,cb=()=>{})=>{
  fs.copy(src,aim).then(()=>{
    cb();
  });
}

let removeOld=(arr)=>{
  arr.forEach(function(url,ind){

    fs.remove(url).then((err)=>{if(err)utils.logError(`remove ${url} fail`)});
  });
}

let configName='vConfig.json';

let defaultConfig={
  lastVersion:"",
  map:{},
  oldDir:""
};






let remove=function(opt){
  let {configDir=null,cacheDir=null,cacheRemove=true}=opt;

  if(cacheDir){cacheDir=utils.getPath(cacheDir);}
  if(configDir){configDir=utils.getPath(configDir);}

  let stream=through.obj(function(file,enc,cb){
    let thisStream=this;

    //错误判断
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }
    if(configDir===null){//没有配置表，报错
      utils.logError('configDir is error,you must to config a valid url tostore match config file');
      return cb();
    }
    //done

    //基本数据
    let {path,relative}=file;
    //done

    //读取配置
    configDir=utils.getPath(configDir);
    let configUrl=nodepath.join(configDir,configName);

    let createReadConfig=function(){
      let next=this;
      utils.ensureReadFile(configUrl,(err,json)=>{
        try{
          json=JSON.parse(json);
        }
        catch(e){
          utils.logError(`$(configUrl) 内容被篡改，请手动更正，初始模板为 ${JSON.stringify(defaultConfig)}`);
        }
        next(json);
      },JSON.stringify(defaultConfig));
    };
    //done




    //移除上一次的版本，和当前的版本
    let removeLastFiles=function(obj){
      let next=this;
      let lastVersion=obj.lastVersion;
      if(lastVersion&&path.indexOf(lastVersion)!==-1){//是上一次得文件
        fs.remove(path).then((err)=>{
          if(err){utils.logError(err);}
          cb();
        });
      }
      else{
        next();
      }
    }
    //done




    //移除缓存内容
    let removeCache=function(){
      let next=this;
      cacheDir=cacheDir?cacheDir:"";
      let aimPath=nodepath.join(cacheDir,nodepath.dirname(relative));

      if(cacheDir&&cacheRemove){
        fs.copy(path,aimPath).then((err)=>{
          if(err){utils.logError(err)}
          fs.remove(path).then((err)=>{
            if(err){utils.logError(err);}
            else{next();}
          })
        });
      }
      else if(cacheRemove===true){
        fs.remove(path).then((err)=>{ err?utils.logError(err):next()})
      }
      else if(cacheDir){
        fs.copy(path,aimPath).then((err)=>{err?utils.logError(err):next();});
      }
    }
    //done

    let lp=utils.loop();
    lp.get(createReadConfig).get(removeLastFiles);
    if(cacheRemove===true){
      lp.get(removeCache)
    }
    lp.get(function(){
      thisStream.push(file);
      cb();
    }).run();

  })

  return stream;
};






//资产编辑
let asset=function(opt={}){//创建hash文件名字，生产配置表  比如match:{},还有一个是last version

if(typeof opt!=='object'){utils.logError(`asset argument error format`);}

let defaultFormat='.'+utils.md5('date_'+(new Date()).getTime());

//获得参数
let {configDir=null,format=defaultFormat}=opt;
//done

let stream=through.obj(function(file,enc,cb){
  let streamThis=this;

  //错误判断
  if (file.isStream()) {
    this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
    return cb();
  }
  if(configDir===null){//没有配置表，报错
    utils.logError('configDir is error,you must to config a valid url tostore match config file');
    return cb();
  }
  //done


  //获得配置位置，并配置
  configDir=utils.getPath(configDir);
  let configUrl=nodepath.join(configDir,configName);
  let createReadConfig=function(){
    let next=this;
    utils.ensureReadFile(configUrl,(err,json)=>{
      try{
        json=JSON.parse(json);
      }
      catch(e){
        utils.logError(`$(configUrl) 内容被篡改，请手动更正，初始模板为 ${defaultConfig}`)
      }
      next(json);
    },JSON.stringify(defaultConfig));
  };
  //done



  //解析文件内容
  let parseFile=function(json){//chunk操作
    let lastVersion=json.lastVersion;//得到上一次的版本
    let path=file.path;
    let relative=file.relative;//相对文件路径
    let originPath=path;
    file.path=path=utils.versionPath(path,format,lastVersion);//更改文件名
    file.vConfig={
      relative,
      originPath,
      path,
      configDir,
      version:utils.parseFormat(format,lastVersion)
    };
    this();
  }
  //done



  //最终运行
  let lp=utils.loop();
  lp.get(createReadConfig).get(parseFile).get(function(){
    streamThis.push(file);
    cb();
  }).run();
  //done


})
return stream;
}









//配置表写入
let configV=()=>{

  let stream=through.obj(function(file,enc,cb){
    //错误判断
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }

    //
    let {vConfig,base}=file;
    let {relative,originPath,path,configDir,version}=vConfig;
    let configUrl=nodepath.join(configDir,'vConfig.json');

    let obj={
      from:utils.normalizeRelativePath(relative),
      to:utils.normalizeRelativePath(nodepath.join(nodepath.dirname(relative),nodepath.basename(path)))
    };


    //读写配置
    fs.readJson(configUrl).then((cig)=>{//读取
      cig.map[obj.from]=obj.to;
      cig.lastVersion=version;
      fs.writeJson(configUrl,cig).then(()=>{//写入
        this.push(file)
        cb();
      }).catch((err)=>{utils.logError(`${configUrl} 写入不到:${err}`);})
    }).catch((err)=>{
      utils.logError(`${configUrl} :${err}`);
    });

  });
  return stream;

};




let template=function(opt){//切换模板内容
let {configDir=null}=opt;
  let stream=through.obj(function(file,enc,cb){
    let thisStream=this;

    //错误判断
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }
    if(configDir===null){//没有配置表，报错
      utils.logError('configDir is error,you must to config a valid url tostore match config file');
      return cb();
    }
    //done

    let {path,base}=file;

    //获得配置位置，并配置
    configDir=utils.getPath(configDir);
    let configUrl=nodepath.join(configDir,configName);
    let createReadConfig=function(){
      let next=this;
      utils.ensureReadFile(configUrl,(err,json)=>{
        try{
          json=JSON.parse(json);
        }
        catch(e){
          utils.logError(`$(configUrl) 内容被篡改，请手动更正，初始模板为 ${defaultConfig}`)
        }
        next(json);
      },JSON.stringify(defaultConfig));
    };
    //done



    //写入模板
    let writeTemplate=function(config){
      let content=file.contents.toString("utf8");
      //整体内容全部替换，不会考虑是否是scripts或者src里面
      let {map,lastVersion}=config;
      let reg="";
      for(let key of Object.keys(map)){
        if(!key||(key.indexOf(lastVersion)!==-1&&lastVersion)){break;}
        reg+=`(${key})|`;
      }
      if(!reg){this();return;}
      reg=reg.slice(0,-1);
      reg=new RegExp(reg,'gm');
      content=content.replace(reg,function(str1){
        return map[str1];
      });
      let cont=new Buffer(content);
      file.contents=Buffer.concat([cont]);
      this();
    };

    //done

 let lp=utils.loop();
 lp.get(createReadConfig).get(writeTemplate).get(function(){
   thisStream.push(file);
   cb();
 }).run();


  });

  return stream;
};





module.exports={
  asset,
  configV,
  remove,
  template
}
