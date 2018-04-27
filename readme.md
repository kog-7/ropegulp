# ropegulp

package small frontend projects workflow simple

![](https://img.shields.io/npm/v/ropegulp.svg?style=flat)

## Features

* synchronous or asynchronous packaging project task
* custom task
* exec other commands

## Installation

```js
//install
npm install ropegulp -g

//use
...somedir>ropegulp create proj1 //create scaffolding files in proj1 dir
...somedir>ropegulp create //create scaffolding files in the current dir
...somedir>npm install //install deps
...somedir>ropegulp task task1 -open //run dev task1 and open the browser
...somedir>ropegulp task task2 //run task2 task
```


## example

write in ropegulpfile.js

```
//run rollup and pug at the same time , after end of rollup and pug ,run copy

let flow=[
[
{engine:'rollup',src:'./src/scripts/index.js',dist:'./dist/scripts',argument:{}},
{engine:'pug',src:'./src/pug/index.pug',dist:'./dist',watch:'./src/pug/**/*',argument:{}}
],
{engine:'copy',src:'./dist',dist:'../proj2/dist',argument:{}}
];

//run all command at same time
let map={
  proj1:[
  {engine:'scss',src:'./src/scss/index.scs',dist:'./dist/styles/css',watch:'./src/scss/**/*',argument:{reload:true}},//update and refresh browser
  {engine:'sprite',src:'./src/images/*',dist:'./dist/images'},//create sprite image
  ],
  proj2:[
  {engine:'pool',src:'./src/scripts/index.js',dist:'./dist/scripts',....}
  ]
};


module.exports={
  task1:{
    map,//optional,map tasks
    flow,//optional,flow tasks
    port:8889,//optional
    staticDir:'./dist',//optional,open browser root dir ,need define port
    staticFile:'./index.html',//optional,open browser file,need define port
    exec:[
    {cmd:'webpack',dir:'./somedir'}//run webpack at the same time in dir somedir
    ],
  }
}


```

## tasks can be used

```
"pug", "require", "scss",
 "copy", "ngHtml", "pool",
 "watch", "concat", 'typescript',
 'version','markdown','freemarker',
 'sprite',"rollup"
```


## api

```
// engine use the above tasks
//src use task origin file path
//dist use task dist dir path
//watch
//argument is write in ## task&&argument
let map={
  proj1:[
  {engine:'pug',src:'./src/pug/index.pug',watch:'./src/pug/**/*',argument:{rename:'',reload:true,htmlmin:{}}}
  ]
}

//flow task is same as map,just run process are different
let flow =[
{task1},
{task2},
[task3,task4,task5],
{task6}
]


module.exports={
task1:{
  map:somemap,//optional,map tasks
  flow:someflow,//optional,flow tasks
  port:8909,//optional
  staticDir:'someRootDir',//optional,browser read root dir
  staticFile:'index.html',//optional,browser read file
  exec:[//optional
    {cmd:'npm start',dir:'../dir1/dir2'}//run cmd in somedir
  ]
}

}

```


## task&&argument

#### build-in task files are in ./ropegulp/src/tasks after use ropegulp create

#### general argument
argument:{reload:true} //refresh browser if setting port&&file&dir in ropegulpfile

#### scss task,scss file

* core lib:[gulp-sass](https://www.npmjs.com/package/gulp-sass)
* lib: [gulp-sass](https://www.npmjs.com/package/gulp-sass),[gulp-rename](https://www.npmjs.com/package/gulp-rename),[gulp-csso](https://www.npmjs.com/package/gulp-csso)

argument:

```
argument:{
  scss:{..}//optional,see gulp-sass config
  rename:{..},//optional,see gulp-rename config
  csso:{..},//optional,see gulp-csso config,
  reload:true//optional
}
```


#### pug task,pug file

* core lib:[gulp-pug](https://www.npmjs.com/package/gulp-pug)
* lib: [gulp-pug](https://www.npmjs.com/package/gulp-pug),[gulp-rename](https://www.npmjs.com/package/gulp-rename),[gulp-htmlmin](https://www.npmjs.com/package/gulp-htmlmin)

argument:

```
argument:{
  htmlmin:{..}//optional,see gulp-htmlmin config
  rename:{..},//optional,see gulp-rename config
  pug:{..},//optional,see gulp-pug config,
  reload:true//optional
}
```


#### pool task,html/css/js file

* core lib: [gulp-pool](https://www.npmjs.com/package/gulp-pool)
* lib: [gulp-pool](https://www.npmjs.com/package/gulp-pool),[gulp-rename](https://www.npmjs.com/package/gulp-rename),[gulp-uglify](https://www.npmjs.com/package/gulp-uglify)

argument:

```
argument:{
  pool:{..}//optional,see gulp-pool config
  rename:{..},//optional,see gulp-rename config
  uglify:{..},//optional,see gulp-uglify config,
  reload:true//optional
}
```


#### rollup task,js file

* core lib:[rollup](https://www.npmjs.com/package/rollup)
* lib: [rollup](https://www.npmjs.com/package/rollup),[rollup-plugin-alias](https://www.npmjs.com/package/rollup-plugin-alias),[rollup-plugin-uglify](https://www.npmjs.com/package/rollup-plugin-uglify),  [rollup-plugin-commonjs](https://www.npmjs.com/package/rollup-plugin-commonjs),[rollup-plugin-node-resolve](https://www.npmjs.com/package/rollup-plugin-node-resolve)

argument

```
argument:{
  alias:{..},//optional,see rollup-plugin-alias config
  rollup:{..},//optional,see rollup config
  commonjs:{..},//optional,see rollup-plugin-commonjs config
  uglify:{..},//optional,see rollup-plugin-uglify config
  resolve:{..},//optional,see rollup-plugin-node-resolve config
  rename:'string',//optional,rename file string
  reload:true//optional
}
```

#### copy task
* lib: [gulp-rename](https://www.npmjs.com/package/gulp-rename),[gulp-uglify](https://www.npmjs.com/package/gulp-uglify)

argument

```
argument:{
  rename:{..},//optional,see gulp-rename config
  uglify:{..},//optional,see gulp-uglify config,
  reload:true//optional
}

```

#### version task,add version in html/js/css,like src="./...js?v=xxx"

use example

```
{engine:'version',
src:{
  template:'./dist/index.html',
  assert:'./dist/asserts'
},
dist:'./dist/somedir',
argument:{
  version:{
    configDir:'./dist/config',//store vConfig.json which have file map
    cacheRemove:true,//whethe remove old file
    format:func//define version rule,if not define,will use md5(new Date()).getTime()
  }
}
}

```

#### markdown task

* core lib:[marked](https://www.npmjs.com/package/marked)
* lib: [marked](https://www.npmjs.com/package/marked),[gulp-rename](https://www.npmjs.com/package/gulp-rename),[gulp-htmlmin](https://www.npmjs.com/package/gulp-htmlmin)

argument:

```
argument:{
  htmlmin:{..}//optional,see gulp-htmlmin config
  rename:{..},//optional,see gulp-rename config
  reload:true//optional
}
```

#### require task ,js file,bundle require module file to one

* core lib:[gulp-requirejs-optimize](https://www.npmjs.com/package/gulp-requirejs-optimize)
* lib: [gulp-requirejs-optimize](https://www.npmjs.com/package/gulp-requirejs-optimize),[gulp-rename](https://www.npmjs.com/package/gulp-rename),[gulp-uglify](https://www.npmjs.com/package/gulp-uglify)

argument:

```
argument:{
  uglify:{..}//optional,see gulp-uglify config
  rename:{..},//optional,see gulp-rename config
  require:{},//optional,see gulp-requirejs-optimize config
  reload:true//optional
}
```


#### ngHtml task, change html to angular.js(v1)&&require.js module

* core lib:[ngHtml](https://www.npmjs.com/package/gulp-ng-html2js)
* lib: [ngHtml](https://www.npmjs.com/package/gulp-ng-html2js),[gulp-rename](https://www.npmjs.com/package/gulp-rename),[gulp-uglify](https://www.npmjs.com/package/gulp-uglify)

argument

```

argument:{
  ngHtml:{
    moduleName:'..',//default apptemplates
    prefix:''
  },
  uglify:{..},//optional, see gulp-uglify
  rename:{..},//optional see gulp-rename
  reload:true
}

```


#### freemarker  task,ftl file,run this task ,must install java and fmpp

* core lib :[freemarker.js](https://www.npmjs.com/package/freemarker.js)
* lib: [freemarker.js](https://www.npmjs.com/package/freemarker.js),[gulp-rename](https://www.npmjs.com/package/gulp-rename),[gulp-htmlmin](https://www.npmjs.com/package/gulp-htmlmin)

argument:

```
argument:{
  freemarker:{
    viewRoot:'src base dir path',
    index:'file name',
    data:{}//optional,template data inject  
    },
  htmlmin:{..}//optional,see gulp-htmlmin config
  rename:{..},//optional,see gulp-rename config
  reload:true//optional
}
```


#### sprite task,image file

* core lib: [gulp.spritesmith](https://www.npmjs.com/package/gulp.spritesmith)
* lib: [gulp.spritesmith](https://www.npmjs.com/package/gulp.spritesmith),[gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin)

argument:

```
argument:{
  sprite:{..}//optional,see gulp.spritesmith config
  imagemin:{..}//optional,see gulp-imagemin config
  rename:{..},//optional,see gulp-rename config
  reload:true//optional
}

```


#### typescript task ,ts file,(support is also less)

* core lib:[tsify](https://www.npmjs.com/package/tsify)
* lib: [tsify](https://www.npmjs.com/package/tsify),[gulp-rename](https://www.npmjs.com/package/gulp-rename),[gulp-uglify](https://www.npmjs.com/package/gulp-uglify)

argument

```

argument:{
  uglify:{..},//optional, see gulp-uglify
  rename:{..},//optional see gulp-rename
  reload:true
}

```

#### watch task,watch file and reload browser

no argument


#### concat task

* core lib:[gulp-concat](https://www.npmjs.com/package/gulp-concat)
* lib: [gulp-concat](https://www.npmjs.com/package/gulp-concat),[gulp-rename](https://www.npmjs.com/package/gulp-rename),[gulp-uglify](https://www.npmjs.com/package/gulp-uglify)

argument:

```

argument:{
  uglify:{..},//optional, see gulp-uglify
  rename:{..},//optional see gulp-rename
  concat:{..},//optional see gulp-concat config
  reload:true
}

```


## custom task

custom task via ropegulp-custom-task dir which is created in 'ropegulp create' cmd,there is a example file in this dir.

```
//if file name is example.js,ropegulpfile.js engine name is example,{engine:'example',src:'..',dist:'...'}
// example.js
let run = function(opt) {
return new Promise(function(resolve,reject){
  // src ,dist,argument is define in task object,
  //browser is browsersync instance,
  //path is current run file path
  //lastSend : if use flow tasks,lastSend is the information from last task
  // lastEngine:is use flow tasks,lastEngine is then engine from last engine
  // type ,flow or map
  // engine now task name
  //allSend all send informations from last all flow tasks
  let { src, dist, argument = {}, browser, path, lastSend, lastEngine, type, engine,allSend} = opt;
  let {
    reload
  } = argument;
  //code task process
  //browser.reload();
  //resolve(..)//if use flow ,send msg to next task
})
};

// export
module.exports = run;

```
