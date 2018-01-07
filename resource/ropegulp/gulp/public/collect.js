var gulp = require("gulp");
var uglify = require('gulp-uglify');
var watchify = require("watchify");
var fs = require("fs-extra");
var path = require("path");
var cwd = process.cwd();
var gulpCollect = require("../collect/index.js");
var getPath = function(url) {
    if (path.isAbsolute(url)) {
        return url;
    } else {
        return path.join(cwd, url);
    }
}


//把其他文件夹的内容，通过url的方式，直接拷贝到当前使用的文件中，通过复制张贴就把文件字符串转移过来！
module.exports = function(src, dist, arg, browser, nowPath,cb,next) { //这里src就是dist，dist为空
    if (!nowPath) {
        return;
    }
    arg = arg ? arg : {};
    var ifReload=arg.reload;
    ifReload=ifReload===undefined?true:ifReload;


    var reload = browser?browser.reload:null;
    try {
        gulp.src(nowPath)
            .pipe(gulpCollect({
                src: getPath(src)
            }))
            .pipe(gulp.dest(path.dirname(nowPath)))
            .on("end", function() {
                // console.log("输出 " + srcFile + " 到 " + distFile);
                if(ifReload&&reload){
                reload();

              }

              if(typeof next==="function"){
                next();
              }
            });
    } catch (e) {
        console.log(e)
    }

}
