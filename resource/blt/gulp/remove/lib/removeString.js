var stringReadRemove=function(str,reg){
var ts=this;
var out="";
var match="",matchStr,ind,middleStr;
var lastInd=0;
var ctr=false;
while(match=reg.exec(str)){
  ctr=true;
  matchStr = match[0];
 ind = match.index, middleStr = str.slice(lastInd, ind), out += middleStr;
 lastInd = reg.lastIndex;
}

if(ctr===false){
  return str;
}
else{
  out+=str.slice(lastInd);
  return out;
}
};

module.exports=stringReadRemove;