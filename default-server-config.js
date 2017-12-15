/* jshint node:true,esversion:6 */
/* this goes in your project directory */
/* All module defaults should be included here */


var config = {
  "app": {},
  "bs": {},
  "postcss": {
    "cssnano": {},
    "autoprefixer": {
    "options":{}
    }
  },
  "sass": {
    "io": {}
  }
}


// node-sass defaults (>= v3.0.0)
config.sass.options = {
  file: null,
  data: null,
  includePaths: [],
  indentedSyntax: false,
  indentType: 'space',
  indentWidth: 2,
  linefeed: 'lf',
  omitSourceMapUrl: false,
  outFile: null,
  outputStyle: 'nested',
  precision: 5,
  sourceComments: false,
  sourceMap: undefined,
  sourceMapContents: false,
  sourceMapEmbed: false,
  sourceMapRoot: undefined
}


// versions 4 and later
config.postcss.cssnano = {
  preset: 'default'
}


config.postcss.autoprefixer = {
  supports: false, //disable @supports parameters prefixing
  flexbox: false, //disable flexbox properties prefixing
  remove: false, //disable cleaning outdated prefixes
  grid: true //enable Grid Layout prefixes for IE
}

config.browserslist = {
}


config.bs = {
  injectChanges: true,
  logLevel: "debug",
  reloadOnRestart: false,
  ghostMode: false,
  //
  online: false,
  tunnel: false,
  open: "local"
};




module.exports = config;
