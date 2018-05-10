let configUrl = "../ropegulpfile.js";
let configObj = require(configUrl);
let logicStart = require("./index");
logicStart.run(configObj.tasks, configUrl);
