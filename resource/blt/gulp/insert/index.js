var path = require("path");
var through = require("through2");
var gutil = require("gulp-util");
var PluginError = gutil.PluginError;
var fs = require("fs-extra");
var cwd = process.cwd();
var sertString = require("./lib/sertString.js");

var storeName = "_blt_890_store_tmp";
var createOrGetFile = function(dist, cback) {
    var dirname = path.dirname(dist),
        basename = path.basename(dist);
    var filePath = storeName + "/" + basename;
    fs.readFile(path.join(dirname, filePath),"utf8", function(err, file) {

        if (err) {

            fs.copy(dist, path.join(dirname, filePath), function() {
                fs.readFile(path.join(dirname, filePath),"utf8", function(err, str) {
                //   console.log(str);
                    cback(str);
                });
            });
        } else {

            cback(file);
        }
    });
};





var mapFile = function(opt) {//插入目标字符串中的一个位置
        opt = opt ? opt : {};
        var sert = opt.insert;
        sert = sert ? sert : /\?blt\?/gm;
        var dist = opt.dist;
        var append=opt.append;
        var stream = through.obj(function(ck, enc, cb) {
                var content = null;
                var ts = this;
                if (ck.isStream()) {
                    this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
                    return cb();
                }
                content = ck.contents.toString("utf8");
                createOrGetFile(dist, function(file) {
                    var newContent = sertString(file, sert, content,append);
                    newContent=new Buffer(newContent);
                    ck.contents = Buffer.concat([newContent]);
                    ts.push(ck);
                    cb();

                });
            });
            return stream;
        };



mapFile.export = function(opt,content,cback) {
    opt = opt ? opt : {};
    var sert = opt.insert;
    sert = sert ? sert : /\?blt\?/;
    var dist = opt.dist;
    var ts = this;
    createOrGetFile(dist, function(file) {
        var newContent = sertString(file, sert, content);
        cback(newContent);
    });
};

module.exports = mapFile;
