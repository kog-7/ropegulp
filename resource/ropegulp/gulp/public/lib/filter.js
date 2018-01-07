var gulp = require("gulp");

var fs = require("fs-extra");
var gulpif = require('gulp-if');
var uglify=require('gulp-uglify');
var minHtml=require("gulp-htmlmin");
var minImage=require("gulp-imagemin");
var gulpInsert=require("../../insert/index.js");
var gulpRemove=require("../../remove/index.js");

var filterOb={
  uglify:uglify,
  minHtml:minHtml,
  insert:gulpInsert,
  remove:gulpRemove,
  minImage:minImage
}

var getValue=function(cmd,arg,src,dist){
  var val=arg[cmd];
  if(!val){return {ifVal:false,val:{}};}
  if(cmd==="insert"){//特殊情况
    return {ifVal:true,val:{insert:val,dist:dist}};
  }
  else{
    return {ifVal:true,val:val};
  }
};


var filter=function(gulpApp,arg,runArr,src,dist,gulpIfOb){//arg是参数，runArr是有哪些参数的集合，gulpIfOb是参数对象是否运行的集合，gulpIfOb()
gulpIfOb=gulpIfOb?gulpIfOb:{};
runArr.forEach(function(cmd,ind){
  var valOb=getValue(cmd,arg,src,dist);
  var ifVal=valOb.ifVal,val=valOb.val;//val是得到的argument的参数
  var ifFun=gulpIfOb[cmd];//当前运行的是哪种中间命令
  ifVal=ifFun?ifFun(ifVal):ifVal;//ifValue返回决定是否运行过滤
  gulpApp=gulpApp.pipe(gulpif(ifVal,filterOb[cmd](val)));
});
return gulpApp
};

module.exports=filter;
