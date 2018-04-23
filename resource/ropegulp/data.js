//解析都在data里面,feature也在里面

let args = process.argv;
let taskName = args[2];
let taskArg = args.slice(3);
let chalk = require("chalk");

let feature = ["rollup","pug", "require", "scss", "copy", "ngHtml", "pool", "watch", "concat", 'typescript','version','markdown','freemarker','sprite'];

class Data {
  constructor() {
    this.store = {
      task: taskName,
      arg: taskArg
    }
    this.task = taskName;
    this.arg = taskArg;
    this.feature=feature;
  }
  isFeature(str) {
    let condi = feature.indexOf(str);
    if (condi === -1) {
      console.log(chalk(`暂时不支持${str}命令配置，或者写错了？`));
    }
    return condi === -1 ? false : true;
  }
  get(attr) {
    return this.store[attr];
  }
  set() {

  }
}

module.exports= new Data();
