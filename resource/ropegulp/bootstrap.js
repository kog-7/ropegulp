let configUrl = "../ropegulpfile.js";
let configObj = require(configUrl);
let run = require("./index");
run.gulp(configObj, configUrl);
