var path = require("path");
var through = require("through2");
var gutil = require("gulp-util");
var PluginError = gutil.PluginError;
var fs = require("fs-extra");
// var cwd = process.cwd();
var removeString = require("./lib/removeString.js");



var mapFile = function(remove) {//remove是多个reg的集合
        var stream = through.obj(function(ck, enc, cb) {
                var content = null;
                var ts = this;
                if (ck.isStream()) {
                    this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
                    return cb();
                }
                content = ck.contents.toString("utf8");
                remove.forEach(function(reg,ind){
                  content=removeString(content,reg);
                });
                var newContent=new Buffer(content);
                ck.contents = Buffer.concat([newContent]);
                ts.push(ck);
                cb();
            });
            return stream;
        };

        mapFile.export = function(remove,content) {
          remove.forEach(function(reg,ind){
            content=removeString(content,reg);
          });
          return content;
        };

        module.exports = mapFile;
