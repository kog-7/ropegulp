# ropegulp
run the gulp tasks you need by writing object ![](https://img.shields.io/npm/v/ropegulp.svg?style=flat)

## Installation&use

```js
//install
npm install ropegulp -g

//use
   //in your dir
   ...somedir>ropegulp create
   //write your ropegulpfile.js
   //run task
   ...somedir>ropegulp task dev -open
   ...somedir>ropegulp task build
```

## supported functionality
* es6:use browserify to pack es6
* pug
* require:pack requirejs file to one
* scss
* copy
* ngHtml:pack html to angularjs module
* pool:use gulp-pool to include all files into one
* watch: watch static files and reload browser
* rollup: use rollup to pack es6

## introduce
* use map to package operations in parallel
* use flow to package the serial operations

## use instructions

```javascript
//ropegulpfile.js
var flow = {//flow is  the serial operations.this is running scss first,then running rollup and finally running pug
  action: [
    { src: "example/scss/index.scss", dist: "./test/css/index.css",engine:"scss"},
    { src: "example/scripts/index.js", dist: "./test/scripts/index.js",argument: { format: 'umd', uglify: true },engine:"rollup"},
    {src: "example/pug/index.pug", dist: "test/index.html",engine:"pug"}
  ],
  watch: ["example/scss/**/*","example/pug/**/*"]
};

//in map,scss,rollup,pug is running at the same time
var mapTest = {
  scss: [
    { src: "example/scss/index.scss", dist: "./test/css/index.css", watch: "example/scss/**/*"}
  ],
  rollup: [
    { src: "example/scripts/index.js", dist: "./test/scripts/index.js", watch: "example/scripts/**/*", argument: { format: 'umd', uglify: true } }
  ],
  pug: [
    {src: "example/pug/index.pug", dist: "test/index.html", watch: "example/pug/**/*"}
  ]
};


var mapBuild={
  copy: [
    { src: "example/images/**", dist: "./build/images"}
  ],
  rollup: [
    { src: "example/scripts/index.js", dist: "./build/scripts/index.js", watch: "example/scripts/**/*", argument: { format: 'umd', uglify: true } }
  ]
}

//each attribute is a gulp command,there are gulp,gulp build,gulp flowTest as follows;
module.exports = {
  default: {
    map: mapTest,
    port: 8166,//port
    open: true,//open the browser or not
    staticDir: "./test",//the static folder that was opened,default is ./
    staticFile:"story.html"// the static file that was opened,default is index.html
  },
  build: {
    map: mapBuild,
    flow:flow
  },
  flowTest: {
    port: 8366,
    open: false,
    flow: flow,
    staticDir: "./test"
  }
}


//cmd
......>ropegulp task default
......>ropegulp task build
......>ropegulp task flowTest
......>ropegulp task default -open //open browser auto

```
