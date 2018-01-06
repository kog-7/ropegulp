var flow = {
  action: [
  {}
  ],
  watch: []
};


var map = {
// pug:[
  // {src:'./src/pug/index.pug',dist:'./build/index.html',watch:'./src/pug/**/*'}
// ]
}


module.exports = {
  default: {
    port: 8890,
    map:map,
    staticDir:'./build',
    staticFile:'./index.html'
  }
}
