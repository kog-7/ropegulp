var include=require("./include.js");

var search=function(content,src,cback){
include({
  template:content,
  callback:cback,
  src:src
})
};
module.exports=search;
