var xtpl = require('xtpl');
var through = require("through2");
var gutil = require("gulp-util");
var useXtpl = function(opt) {//插入目标字符串中的一个位置
        opt = opt ? opt : {};
        var stream = through.obj(function(ck, enc, cb) {
                var content = null;
                var ts = this;
                if (ck.isStream()) {
                    this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
                    return cb();
                };
                var ph=ck.path;
                // content = ck.contents.toString("utf8");
                xtpl.renderFile(ph,opt.data,function(error,content){
                  // console.log(content);
                  if(error){
                    console.log(error);
                    cb();
                  }
                  else{
                    content=new Buffer(content);
                    ck.contents = Buffer.concat([content]);
                    ts.push(ck);
                    cb();
                  }
                });
            });
            return stream;
        };



module.exports=useXtpl;
