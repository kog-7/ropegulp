#!/usr/bin/env node
let data=require("./src/data.js");
let bootstrap=require("./src/bootstrap.js");
let args = Array.prototype.slice.call(process.argv, 2);
data.init(args);//同步的
bootstrap();
