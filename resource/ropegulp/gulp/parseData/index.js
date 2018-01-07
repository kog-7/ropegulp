var fs = require("fs-extra");
var rp = require("request");
var path=require("path");
var cwd=process.cwd();

var getPath = function(url) {
    if (path.isAbsolute(url)) {
        return url;
    } else {
        return path.join(cwd, url);
    }
};

var getCont=function(url){
  var tp=url.substr(0,3);
  return {type:tp,url:url.slice(4,-1)};
};





var parseType = function(type,url) {
    url=getPath(url);
    if (type==="url") {//使用url的
      delete require.cache[require.resolve(url)];
      var data = require(url);
      return data;
  } else if(type==="cdn") {
      //暂时不支持
        return {};
    }
    else{
      return {};
    }
};




var parse=function(data){//解析自定义data
  var tp=typeof data;
  if(tp==="object"){return data;}
if(tp==="string"){
  var urlOb=getCont(data);
  return parseType(urlOb.type,urlOb.url);
}
return {};
}

module.exports=parse;
