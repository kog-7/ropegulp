let gulp=require("gulp");
let data=require("../data.js");
let nodepath=require("path");
// const spawn = require('child_process').spawn;
// const execa=require('execa');
const spawn = require('cross-spawn');
let cwd=process.cwd();
let ropegulpPath=nodepath.join(__dirname,"../../resource");
let args=Array.from(process.argv).slice(3);


module.exports=function(){
  let npmIndex=args.indexOf('-npm');
  let val=null;
  if(npmIndex!==-1){
    val=args[npmIndex+1];
  }
  val=val?val:'npm';
  // let args=data.get("args");
  let name=data.get('name')[0];
  if(name.indexOf('-npm')!==-1){
    name="./";
  }
  let distDir=nodepath.join(cwd,name);

  // const child = spawn(command, args, { stdio: 'inherit' });
  // child.on('close', code => {

  return gulp.src(ropegulpPath+'/**/*').on("end",function(){
    console.log(`ropegulp was sent to ${distDir}`);
    console.log('install packages,waiting...');
    let execOb=spawn(`${val}`,['i'],{cwd:distDir,stdio: 'inherit'});


    // execOb.stderr.on('data', (data) => {
    //   console.log(data.toString());
    // });
    execOb.on('close', (code) => {
      console.log(`exited with ${code}`);
    });



  }).pipe(gulp.dest(distDir));
}
