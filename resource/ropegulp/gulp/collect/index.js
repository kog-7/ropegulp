//对于组件的收集
var path = require("path");
var through = require("through2");
var gutil = require("gulp-util");
var PluginError = gutil.PluginError;
var fs = require("fs-extra");
var cwd = process.cwd();
var search=require("./lib/search.js");

var mapFile = function(opt) {//插入目标字符串中的一个位置
        opt = opt ? opt : {};
        var src = opt.src;
        var stream = through.obj(function(ck, enc, cb) {
                var content = null;
                var ts = this;
                if (ck.isStream()) {
                    this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
                    return cb();
                }
                content = ck.contents.toString("utf8");
                var newContent = search(content,src,function(strOb){
                  ck.contents = Buffer.concat([new Buffer(strOb.html)]);
                  ts.push(ck);
                  cb();
                });
            });
            return stream;
        };


        module.exports = mapFile;
