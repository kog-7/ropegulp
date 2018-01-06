var cwd = process.cwd();
var path = require("path");
var gulp = require("gulp");
var fs = require("fs-extra");
var utils = require("./utils.js");
var abilityList = ["es6","pug", "require", "scss", "copy", "ngHtml", "collect", "pool", "jade","watch","rollup"];



var watchClean = [];

var ability = {},
    lastConfig = {},
    lastArg = {};
watchs = {};
var basePath ="public/";
var clean = [];

abilityList.forEach(function (str, ind) {
    ability[str] = require("./"+path.join(basePath, str));
    lastConfig[str] = {};
    // watchClean[str] = [];
});





var getPath = function (url) {
    if (typeof url !== "string") {
        return url;
    }
    if (path.isAbsolute(url)) {
        return url;
    } else {
        return path.join(cwd, url);
    }
}



var eqPath = function (arr1, arr2) {
    if (!arr1 || !arr2) {
        return false;
    }
    if (arr1 === arr2) {
        return true;
    }
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



var setArrPath = function (arr) {
    if (!arr) { return false; }
    if (typeof arr === "string") {
        return getPath(arr);
    }

    arr.forEach(function (str, ind) {
        arr[ind] = getPath(str);
    });
    return arr;
};




module.exports = function (flow, browser,watchIdsObj) {
var watch=flow.watch,mapCont=flow.action;
var watchIds=watchIdsObj.collect;

    var runAll = [];
    var nowPath = null;
    if(!mapCont){return;}
    if(mapCont.length===0){return;}

    mapCont.forEach(function (task, ind) {//单个task为一个任务



        var src = task.src,
            dist = task.dist;
        var argument = task.argument;
        var engine = task.engine;//引擎
        var useAbility = ability[engine];//执行的功能
        if(!src){return;}//如果没有src文件，就不执行
        src = setArrPath(src), dist = setArrPath(dist);
        runAll.push(function (next) {
            return function () {
                // console.log(useAbility,123);
                useAbility(src,dist,argument, browser, nowPath, null, next)

            }
        });
    });

    var lgs = mapCont.length;
    for (var i = lgs - 1; i >= 0; i -= 1) {
        var j = i + 1;
        var nextRun = runAll[j];
        runAll[i] = runAll[i](nextRun);
    }


    runAll[0]();

    // watchIds.forEach(function(obj,ind){
    //   if(obj){
    //     obj.tf=1;
    //   }
    // });
    // watchIds=[];
    var tf = { tf: 0 };
    watchIds.push(tf);


    if(!watch){return;}


    var watchId=gulp.watch(watch, function (event) {

        if (tf.tf === 1) { return; }
        runAll[0]();
    });
    tf.watch=watchId;



};
