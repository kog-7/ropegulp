class BranchClass {
  constructor() {
    this.lastInstance = this.nowInstance = null;
    this.error=this.callback=()=>{};//错误回调函数
    this.step=null;//step表示当前运行的函数
  }
  setError(f){
    if(typeof f==="function"){
      this.error=f;
    }
    return this;
  }
  setCallback(f){
    if(typeof f==="function"){
      this.callback=f;
    }
    return this;
  }
  wrap(f,props) {//状态有pending，process,done
    let {error,callback}=this;
    let ts=this;
    return (lastInstance=null) => {
      var funcOb={
      run(nextInstace=null){
        // if(lastInstance!==null){lastInstance.status='done';}//得到上一次状态的情况，并且更改,this表示lastsend
        ts.step=f;//当前正在运行的函数
        return f.call(this,...props).then(function(lastSend) {//.callthis表示对上一次run.call的f集成

          if(nextInstace==null){//如果没有下一步，执行callback
            ts.lastInstance=ts.nowInstance=ts.error=ts.callback=ts.step=null;
            return callback(lastSend);
          }
          // nextInstace.status='process';
          return nextInstace.run.call(lastSend);//上一次传过来的东西会作为this在原来的函数中
        }).catch(function(err) {
          ts.lastInstance=ts.nowInstance=ts.error=ts.callback=ts.step=null;
          return error(err);
          // error(...err);
        });
      },
      status:'pending'
    }
      if (lastInstance !==null) {
        let run = lastInstance.run;
        lastInstance.run = (lastSend) => {
             run.call(lastSend,funcOb);
        }
      }
      return funcOb;
    }
  }
  get(f,...props) {
    let {
      nowInstance,
      lastInstance
    } = this;
    let newInstance = this.wrap(f,props)(lastInstance);
    if(nowInstance===null){this.nowInstance=newInstance;}
    this.lastInstance=newInstance;
    return this;
  }
  run(){
      this.nowInstance.run();
      return this;
  }
}



let Branch=function () {
  return new BranchClass();
};
module.exports=Branch;
