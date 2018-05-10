let data=require("./data.js");
let feature=require("./feature");
let action=require("./action/index.js");

module.exports=()=>{
  let type=data.get("type");
  let name=data.get("name");
  let args=data.get("args");

  //配置的内容
  for(let i in feature){
    let obj=feature[i];
    let {name,cmd}=obj;
    if(cmd.test(type)&&(name in action)){
      action[name]();
    }
  }


}
