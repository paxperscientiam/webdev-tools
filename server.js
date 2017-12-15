// references
// https://github.com/babel/babili/tree/master/packages/babel-preset-babili#options

// builtin
const path = require('path');
const fs = require('fs');
const cwd = process.cwd();
//
const term = require( 'terminal-kit' ).terminal;

try {
  if (path.relative(cwd,__dirname) === '')
    throw new Error("Cannot run this script from its own directory!\n");
} catch (e) {
  term.error.red(e.message);
  process.exit(1);
}


require('cache-require-paths');
// // auto polyfill
require('es6-promise').polyfill();
//
//
const _ = require('lodash');
const kat = require('concat');
//
const sass = require("node-sass"),
      postcss = require('postcss'),
      cssnano = require('cssnano'),
      clean = require('postcss-clean'),
      autoprefixer = require('autoprefixer'),
      postcssFlexbugsFixes = require('postcss-flexbugs-fixes'),
      fontMagic = require('postcss-font-magician')({}),
      devtools = require('postcss-devtools')({silent: true});
//
//
//
//
const webpack = require("webpack"),
      BabiliPlugin = require("babili-webpack-plugin"),
      UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
      ExtractTextPlugin = require("extract-text-webpack-plugin"),
      WebpackBuildNotifierPlugin = require('webpack-build-notifier');


const bs = require("browser-sync").create();



///// CONFIGURATION HANDLING
var config = require("./default-server-config.js");
//
try {
  _.merge(config, req("./server-config.js"));
  term.green("Using user configuration.\n");
} catch (e) {
  term.error(e.message);
  term.green("Using default configuration.");
}


function customizer(objValue, srcValue) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}


var configWebpack = config.webpack;
_.mergeWith(configWebpack, {
  resolve: {
    modules: [
      path.resolve(cwd, 'node_modules')
    ]
  },
  plugins: [
    new WebpackBuildNotifierPlugin({
      title: "My Project Webpack Build",
      suppressSuccess: true
    }),
    //    new UglifyJSPlugin(),
    new BabiliPlugin(),
    new ExtractTextPlugin("[name].css"),
    new webpack.BannerPlugin('Compile initiated at ' + new Date()),
    function() {
      this.plugin('watch-run', function(watching, callback) {
        console.log('Begin compile at ' + new Date());
        callback();
      })
    }
  ]
}, customizer)


term.green(configWebpack);





var compiler = webpack(config.webpack);

compiler.watch({ // watch options:
  aggregateTimeout: 300, // wait so long for more changes
  poll: true // use polling instead of native watchers
  // pass a number to set the polling interval
}, function(err, stats) {
  console.log('Compile ends at ' + new Date())
  console.log(stats);
  // ...
});

//
bs.init(config.bs, () => {
  term.blue("BrowserSync server started.\n");
  assemble();
})

bs.watch(config.sass.io.base, (e, file)  => {
  if (e === "change") {
    term("[").blue("BS")("] ")(file + " changed.\n");
    assemble();
  }})


var use_sass = false;
if (!_.isEmpty(config.sass))
  use_sass = true;


const network = config.network

//
///////

// only cssnano is included by default
const processor = postcss([
        devtools,
        clean,
        autoprefixer(config.postcss.autoprefixer),
        //  cssnano(config.postcss.cssnano),
        postcssFlexbugsFixes()
      ]);


// async read
fs.readFileAsync = function(filename) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filename, function(err, data){
      if (err)
        reject(err);
      else
        resolve(data);
    });
  });
};



const processCSS = (css) => {
        processor
          .process(css)
          .then(result => {
            devtools.printSummary();
            return new Promise(function(resolve, reject) {
              fs.writeFile(
                path.join(cwd, config.app.css.base, "main.css"),
                result.css, function (err) {
                  if (err) reject()
                  if (!err) resolve()
                })
            })
          })}

//
const xSCSS = () => {
        return new Promise(function (resolve, reject) {
          sass.render(config.sass.options, (error, result) => {
            if (error) {
              term.str(term.error.red(error.message)
                       .yellow(
                         "\nSee @("
                           +error.line
                           +", "
                           +error.column
                           +")\n"));

              reject();
            } else {
              term("(^bsass^:) ∆t ≈ "+result.stats.duration+"ms\n");
              term("(^bsass^:) Entry: ")
                .cyan(path.relative(cwd,result.stats.entry)+'\n')
              // pass buffered css
              resolve(result.css);
            }
          });
        });
      }


const assemble = () => {
        return promiseTry(function () {
          xSCSS()
            .then(function(css) {
              return processCSS(css);
            })
        })}



function promiseTry(func) {
  return new Promise(function(resolve, reject) {
    resolve(func());
  })
}


function req(module) {
  return require(path.join(cwd, module));
}
