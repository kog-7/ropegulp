var path=require("path");

var toArray=function(arg){
  return Array.prototype.slice.call(arg,0);
}

var join=function(){//可以把参数里面所有的路径都加起来
  var arr=toArray(arguments),ph="";
  arr.forEach(function(url){
    ph=path.join(ph,url);
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


var getFileName=function(file){
var ind=file.lastIndexOf("/");
return file.slice(ind+1);
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
    for (i in ob) { aob[i] = ob[i]; }
    return aob;
}


var branch=(function(){
var isFun=function(f){return (typeof f)==="function";},toArray=function(){
    return Array.prototype.slice.call(arguments[0], 0);
};
    var bra=function(){//id从零开始起
    if(!(this instanceof branch)){return new branch();}
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






module.exports={
toArray:toArray,
join:join,
getFileName:getFileName,
miniExtend:miniExtend,
coverExtend:coverExtend,
branch:branch,
typeHim:typeHim
}
