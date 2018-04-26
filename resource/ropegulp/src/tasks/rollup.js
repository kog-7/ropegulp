var gulp = require('gulp');
const nodepath=require("path");
// let $$ = require('gulp-load-plugins')();
let utils = require('../utils.js');
let builtins = require('rollup-plugin-node-builtins');
let rollup=require('rollup');
let rollupCommonjs=require('rollup-plugin-commonjs');
let rollupResolve=require('rollup-plugin-node-resolve');
let aliasPlugin = require('rollup-plugin-alias');
let uglifysPlugin=require('rollup-plugin-uglify');

let run = function(opt) {
  return new Promise(function(resolve,reject){
    let { src, dist, argument = {}, browser, path:ph, lastSend, lastEngine, type, engine,allSend} = opt;
    let {
      reload,
      alias,
      commonjs={},
      uglify,
      resolve:resolveArg={},
      rename//为一个function
    } = argument;

    let coreArg = argument[engine];
    coreArg = coreArg ? coreArg : {};
    let distFile=nodepath.join(dist,nodepath.basename(src));

    if(typeof rename==='string'){
      distFile=nodepath.join(dist,rename);
    }

    let plugins=[
      builtins(),
      rollupResolve(Object.assign({
        main:true,
        browser:true
      },resolveArg)),
      rollupCommonjs(Object.assign({
          include: 'node_modules/**'
      },commonjs))
    ];
    if(alias){
      plugins.push(aliasPlugin(alias));
    }
    if(uglify){
      uglify=uglify===true?{}:uglify;
      plugins.push(uglifyPlugin(uglify));
    }

    rollup.rollup({
      input: src,
      plugins: plugins
    }).then(bundle => {
      return bundle.write(Object.assign({
        file: distFile,
        format: 'umd',
        name: 'library',
        sourcemap: true
      },coreArg));
    }).then(function(){
      if (reload && browser) {
        browser.reload();
      }
      utils.logDone(engine,src,distFile);
      resolve();
    })
  });
};

run.plugins = ['uglify', 'rename'];

// run.
module.exports = run;
