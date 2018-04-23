let gulp=require("gulp");
let data=require("../data.js");
let path=require("path");
let cwd=process.cwd();
let chalk=require("chalk");
let ropegulpPath=path.join(__dirname,"../../resource");

module.exports=function(){
let name=data.get("name");
let obj=require(path.join(ropegulpPath,`ropegulp/src/tasks/${name}.js`));
console.log(chalk.green(`engine:${name}\nplugins:${obj.plugins}\nargument:${obj.argument}`));
}
