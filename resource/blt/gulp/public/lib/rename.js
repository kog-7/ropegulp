var path = require("path");

var rename = function(src, dist) {

    var dirname = path.dirname(dist),
        basename = path.basename(dist);
    if (basename.indexOf(".") === -1) {
        dirname = dist;
        basename = null;
    }
    // var srcName=path.basename(src);
    // if(distName===null){
    //   distName=srcName;
    // }
    return {dirname:dirname,basename:basename};
};


module.exports = rename;
