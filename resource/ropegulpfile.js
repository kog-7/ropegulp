
//

var flow = {
  action: [
    {}
  ],
  watch: []
};


let proj1=[
  // {engine:'sprite',src:'./src/images/*',dist:'./dist',argument:{sprite:{
  //   scale:0.5,
  //   imgName:'kog.png'
  // }}},
  // {engine:'pool',src:'./src/index.js',dist:'./dist',argument:{rename:'kkk.js'}}
  // {engine:'inject',src:'./src/test.js',dist:'./test',watch:'./src/test.js',argument:{from:'./test/b.js',reload:true}},
  // {engine:'pool',src:'./src/country_es5/index.js',dist:'./dist',watch:'./src/country_es5/*.js',argument:{rename:{basename:'jquery-plugin-country'},reload:true}},
  // {engine:'scss',src:'./src/scss/office.scss',dist:'./dist',watch:'./src/scss/office.scss',argument:{reload:true}},
  // {engine:'pool',src:'./src/scripts/index.js',dist:'./dist',watch:'./src/scripts/**/*',argument:{reload:true,rename:{basename:'office'}}},
  // {engine:'pool',src:'./src/html/index.html',dist:'./dist',watch:'./src/html/**/*',argument:{reload:true,rename:{basename:'schedule'}}}
];


module.exports = {
  tasks:{
    default: {
      // browser:{
      //   port: 8880,
      //   server:{
      //     index:'index.html',
      //     baseDir:'./dist'
      //   }
      // },
      // exec:[
      //
      // ],
      // flow:flow,
      map:proj1

    }
  }

}
