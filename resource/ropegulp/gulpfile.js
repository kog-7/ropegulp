let configUrl = "../ropegulpfile.js";
let configObj = require(configUrl);
let blt = require("./index");
blt.gulp(configObj, configUrl);
