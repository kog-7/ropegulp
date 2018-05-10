let baseDeps=['gulp','gulp-load-plugins','gulp-plumber','gulp-if'];
let deps={
  concat:[{name:'gulp-concat'},{name:'gulp-rename'},{name:'gulp-htmlmin'}],
  copy:[{name:'gulp-uglify'},{name:'gulp-rename'}],
  freemarker:[{name:'freemarker.js'},{name:'through2'},{name:'gulp-rename'},{name:'gulp-htmlmin'}],
  markdown:[{name:'marked'},{name:'through2'},{name:'gulp-rename'},{name:'gulp-htmlmin'}],
  ngHtml:[{name:'gulp-htmlmin'},{name:'gulp-ng-html2js'},{name:'gulp-concat'},{name:'gulp-uglify'},{name:'gulp-rename'}],
  pool:[{name:'gulp-pool'},{name:'gulp-uglify'},{name:'gulp-rename'}],
  pug:[{name:'gulp-pug'},{name:'gulp-uglify'},{name:'gulp-rename'},{name:'gulp-htmlmin'}],
  require:[{name:'gulp-requirejs-optimize'},{name:'gulp-uglify'},{name:'gulp-rename'}],
  rollup:[{name:'rollup-plugin-node-builtins'},{name:'rollup-plugin-commonjs'},{name:'rollup'},{name:'rollup-plugin-node-resolve'},{name:'rollup-plugin-alias'},{name:'rollup-plugin-uglify'}],
  scss:[{name:'gulp-sass'},{name:'gulp-autoprefixer'},{name:'gulp-rename'},{name:'gulp-csso'}],
  sprite:[{name:'gulp.spritesmith'},{name:'vinyl-buffer'},{name:'gulp-imagemin'}],
  typescript:[{name:'tsify'},{name:'vinyl-source-stream'},{name:'vinyl-buffer'},{name:'gulp-uglify'},{name:'gulp-rename'}],
  version:[{name:'glob'},{name:'gulp-uglify'},{name:'gulp-rename'},{name:'through2'}],
  watch:[]
};
module.exports={
  base:baseDeps,
  deps
}
