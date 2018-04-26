#!/usr/bin/env node
let data=require("./src/data.js");
let bootstrap=require("./src/bootstrap.js");
let args=Array.from(process.argv).slice(2);
data.init(args);//同步的
bootstrap();
