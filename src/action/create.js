let gulp=require("gulp");
let data=require("../data.js");
let path=require("path");
let cwd=process.cwd();
let ropegulpPath=path.join(__dirname,"../../resource");

module.exports=function(){
let args=data.get("args");
gulp.src(ropegulpPath+'/**/*').on("end",function(){
console.log("ropegulp is send to "+cwd);
}).pipe(gulp.dest(cwd));
}
