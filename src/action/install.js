let gulp=require("gulp");
let data=require("../data.js");
let path=require("path");
const exec = require('child_process').exec;
const chalk=require("chalk");
let cwd=process.cwd();
let args=Array.from(process.argv).slice(3);



// let ropegulpPath=path.join(__dirname,"../../ropegulp");

let normal=(inArg)=>{
let names=data.get("name");
let name=names[0];
let depsObj=require(path.join(process.cwd(),`./ropegulp/dependence.js`));
let features=require(path.join(process.cwd(),`./ropegulpfile.js`)).features;
let {base,deps}=depsObj;
let installs=base.concat([]);
features.forEach(function(feat,ind){
  if(feat in deps){
    let ffs=deps[feat];
    ffs.forEach(function(obj,ind){
      let {name,version}=obj;
      if(installs.indexOf(name)===-1){
        installs.push(name);
      }
    });
  }
});


console.log('install packages,waiting...');
installs.forEach(function(ins){
  let execOb=exec(`${inArg} i ${ins} -S`);
  execOb.stdout.on('data',function(data){
    console.log(data)
  })

  execOb.stderr.on('data',function(data){
    console.log(`${data}`);
  })
});



}

// execOut.stdout.on('data',function(data){
//   console.log(data)
// })
//
// execOut.stderr.on('data',function(data){
//   console.log(`error: ${data}`);
// })
// };



var actionTypes={
npm:{cmd:/^(-npm)|(--npm)$/g}
};


module.exports=function(){
let tp=args[0],val=args[1];

let ag=null;
if(tp==='--npm'||tp==='-npm'){
  ag=val;
}
ag=ag==="cnpm"?'cnpm':'npm';
normal(ag);
}
