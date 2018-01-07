var gulp = require("gulp");


module.exports = function(src, dist, arg, browser,nowPath,cb,next) {
var reload = browser?browser.reload:null;
if(!reload){return;}
arg=arg?arg:{};
var load=arg.reloadType;
load=load?load:"html";
if(load==="css"){
  gulp.pipe(src).pipe(reload({stream:true})).on("end",function(){
    console.log("on watch "+src);
  });
}
else{
  reload();
}


//
// if(load==="css"){
//
//
// }
// else{
//   gulp.watch(src,function(){
//     if(load==="css"){
//       reload&&reload();
//     }
//     else{
//       reload&&reload();
//     }
//
//   });
// }



};
