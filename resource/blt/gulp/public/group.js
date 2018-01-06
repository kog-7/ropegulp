var gulp = require("gulp");
var fs = require("fs");
var path = require("path");
var parseData = require("../parseData/index.js");
// var filterGulp = require("./lib/filter.js");
var gulpInsert = require("../insert/index.js");
var gulpContent = require("../getContent/index.js");
var gulpGroupContent = require("../groupContent/index.js");
var cwd = process.cwd();
var basePath = "./";
var configUrl = path.join(cwd, "config.js");
var rename = require("gulp-rename");
var utils = require("../utils.js");
var branch = utils.branch;

var getPath = function(url) {
    if (typeof url !== "string") {
        return url;
    }
    if (path.isAbsolute(url)) {
        return url;
    } else {
        return path.join(cwd, url);
    }
}
var abilityList = ["es6", "pug", "require", "scss", "ngHtml", "pool", "xtpl", "jade"],
    ability = [];
abilityList.forEach(function(str, ind) {
    ability[str] = require("./"+path.join(basePath, str));
    // lastConfig[str] = {};
    // watchClean[str] = [];
});


module.exports = function(srcArr, dist, arg, browser, nowPath, cb, next) {

    // console.log(srcArr, dist, arg, browser, app,nowPath,cb,next);

    if (typeof srcArr !== "object") {
        console.log(srcArr + " src must be array");
        return;
    }
    arg = arg ? arg : {};
    var ifReload = arg.reload;
    ifReload = ifReload === undefined ? true : ifReload;

    var distDir = path.dirname(dist),
        distName = path.basename(dist);
    var reload = browser.reload;
    var dataObj = parseData(arg.data);
    var engine = arg.engine;
    engine = engine ? engine : [];
    var argument = arg.argument; //单文件每个内容处理的argument,为[{}],为多个src的处理
    var bra = branch();

    var gulpAppArr = [];
    var firstApp = null;


    srcArr.forEach(function(src, ind) {
        src = getPath(src);

        bra.get(function(gApp) {
            var that = this;
            var eng = engine[ind];
            var tempArg = argument[ind];
            tempArg = tempArg ? tempArg : {};
            var tapp = null;
            if (!eng) {
                tapp = gulp.src(src);
                firstApp = {//firstApp是运行中一直变化的app gulp
                    app: tapp,
                    insert: tempArg.insert
                };
                // gulpAppArr.push({
                //   content:""
                // });
                //让app
                firstApp.app=tapp.pipe(gulpContent(function(cont) {
                    gulpAppArr.push({
                        content: cont,
                        insert: tempArg.insert
                    });
                    that();
                }));
                return;
            }

            ability[eng](src, dist, tempArg, null, null, null, function(gulpApp) { //中途回调

                gulpApp = gulpApp.pipe(gulpContent(function(cont) {
                    gulpAppArr.push({
                        content: cont,
                        insert: tempArg.insert
                    });
                    that();
                }));
                if (ind === 0) {
                    firstApp = {
                        app: gulpApp,
                        insert: tempArg.insert
                    };
                }
            });
        });
    });

    bra.get(function() { //如果有insert，则插入，否则，往文件后面叠加一个
        var gApp = null;
        var app = firstApp.app;
        // console.log(app);
        app = app.pipe(gulpInsert({ //第一个app正常使用插入来获得第一次插入得到的数据
            insert: firstApp.insert,
            dist: dist,
            append: "append"
        }));




//合并gulpArr里面所有的内容，然后统一输出
        app.pipe(gulpGroupContent(gulpAppArr.slice(0))).pipe(rename(distName)).pipe(gulp.dest(distDir)).on("end", function() {
            console.log("输出 " + srcArr + " 到 " + dist);
            (reload && ifReload) && reload();
            if (typeof next === "function") {
                next();
            }
        }); //第一个app已经处理了

    }).run();
}
