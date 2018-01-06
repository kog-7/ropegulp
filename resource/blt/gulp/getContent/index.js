var path = require("path");
var through = require("through2");
var gutil = require("gulp-util");
var PluginError = gutil.PluginError;
var fs = require("fs-extra");
var cwd = process.cwd();

var getCont = function(cback) {//插入目标字符串中的一个位置
        var stream = through.obj(function(ck, enc, cb) {
                var content = null;
                var ts = this;
                if (ck.isStream()) {
                    this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
                    return cb();
                }
                content = ck.contents.toString("utf8");
                cback(content);

                content=new Buffer(content);
                ck.contents = Buffer.concat([content]);
                ts.push(ck);
                cb();
            });
            return stream;
        };

        module.exports=getCont;
