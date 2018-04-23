let gulp=require("gulp");
let data=require("../data.js");
let path=require("path");
const exec = require('child_process').exec;
const chalk=require("chalk");
let cwd=process.cwd();
// let ropegulpPath=path.join(__dirname,"../../ropegulp");

let normal=(action=[])=>{
let names=data.get("name");
let name=names[0];
let execOut=exec(`node ./ropegulp/bootstrap.js ${name} ${action.join(" ")}`);
console.log(chalk.green(`begin in you ${cwd} and run ropegulp directory && ropegulpfile.js`));
execOut.stdout.on('data',function(data){
  console.log(data)
})

execOut.stderr.on('data',function(data){
  console.log(`error: ${data}`);
})
};

var actionTypes={
open:{cmd:/^(-open)|(--open)$/g,action:"open"}
};


module.exports=function(){
let args=data.get("args");
let arg="";
if(args[0]){arg=args[0].type}
let inArgs=[];
for(let i in actionTypes){
  let actionType=actionTypes[i];
  if(actionType.cmd.test(arg)){
    inArgs.push(actionType.action);
  }
}
normal(inArgs);
}
