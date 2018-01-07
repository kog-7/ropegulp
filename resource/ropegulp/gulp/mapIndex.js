var cwd = process.cwd();
var path = require("path");
var gulp = require("gulp");
var fs = require("fs-extra");

//watch是只有map才有的指令，表示任意监听一个内容
var abilityList = ["es6","pug", "require", "scss", "copy", "ngHtml", "collect", "pool", "jade","watch","rollup"];
var ability = {},
    lastConfig = {}, lastArg = {},
    watchClean = {};
var basePath = "public";
// var configUrl = path.join(cwd, "config.js");

abilityList.forEach(function (str, ind) {
    ability[str] = require("./"+path.join(basePath, str));
    lastConfig[str] = {};
    watchClean[str] = [];

});


var getPath = function (url) {
    if (typeof url !== "string") { return url; }
    if (path.isAbsolute(url)) {
        return url;
    } else {
        return path.join(cwd, url);
    }
}

var eqPath = function (arr1, arr2) {
    if (!arr1 || !arr2) { return false; }
    if (typeof arr1 !== typeof arr2) {
        return false;
    }
    var n = arr1.length;
    if (n !== arr2.length) {
        return false;
    }
    var i = 0;
    for (; i < n; i += 1) {
        if (arr2[i] !== arr1[i]) {
            return false;
        }
    }
    return true;
}

var setArrPath = function (arr) {//需要后面优化
    if (!arr) { return; }
    if (typeof arr === "string") {
        return getPath(arr);
    }
    if (arr.slice) {
        arr.forEach(function (str, ind) {
            arr[ind] = getPath(str);
        });
        return arr;
    }

};


module.exports = function (engine, mapCont, browser,watchIdsObj) {
var watchIds=watchIdsObj.collect;

    mapCont.forEach(function (task, ind) {
        //这里解析出来的内容肯定是一个具体的任务
        var src = task.src, dist = task.dist, watch = task.watch, argument = task.argument;
        if(!src){return;}//如果没有src文件，就不执行
        src = setArrPath(src), dist = setArrPath(dist), watch = setArrPath(watch);
        var useAbility = ability[engine];//使用能力


        useAbility(src, dist, argument, browser, null);
        // watchIds.forEach(function(obj,ind){
        //   if(obj){
        //     obj.tf=1;
        //   }
        // });
        // watchIds=[];
        var tf={tf:0};
        watchIds.push(tf);

        var watchId=gulp.watch(watch, function (event) {//被监听的文件改变的话，执行相应的工作内容

            if(tf.tf===1){return;}

        //  console.log("map chaged")
            useAbility(src, dist, argument, browser, event.path);

        });
          tf.watch=watchId;
    });


};
