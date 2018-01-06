var path = require("path");
var through = require("through2");
var gutil = require("gulp-util");
var PluginError = gutil.PluginError;
var fs = require("fs-extra");
var cwd = process.cwd();
var sertString = require("./lib/sertString.js");


//收集所有的内容，并替换占位符
var mapFile = function(source) { //插入目标字符串中的一个位置

    var stream = through.obj(function(ck, enc, cb) {
        var content = null;
        var ts = this;
        if (ck.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return cb();
        }
        content = ck.contents.toString("utf8"); //要被站位的内容
        var newContent = "";
        source.forEach(function(ob, ind) {
            var insert = ob.insert;
            var str = ob.content;
            newContent = sertString(content, insert, str);
        });
        newContent = new Buffer(newContent);
        ck.contents = Buffer.concat([newContent]);
        ts.push(ck);
        cb();
    });
    return stream;
};


module.exports = mapFile;
