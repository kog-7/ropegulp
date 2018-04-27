let gulp=require("gulp");
let data=require("../data.js");
let nodepath=require("path");
let cwd=process.cwd();
let ropegulpPath=nodepath.join(__dirname,"../../resource");

module.exports=function(){
// let args=data.get("args");
let name=data.get('name')[0];
let distDir=nodepath.join(cwd,name);

return gulp.src(ropegulpPath+'/**/*').on("end",function(){
console.log("ropegulp is sended to "+distDir);
}).pipe(gulp.dest(distDir));
}
