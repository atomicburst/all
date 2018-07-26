
const path =require("path");
const rollup  =require("rollup");
const TypescriptPlugin  =require("./plugins/typescript_plugin");
const SassPlugin  =require("./plugins/sass_plugin");
const ImagePlugin  =require("./plugins/image_plugin");
const JavascriptPlugin  =require("./plugins/javascript_plugin");
const BabelPlugin  =require("./plugins/babel_plugin");
const Gaze = require('gaze').Gaze;
const fs = require('fs');
const RollupPlugin =require('./plugins/rollup_plugin');
const cheerio = require('cheerio')
const replace = require('rollup-plugin-replace')
const http = require('http');
const mime  = require('mime-types');

module.exports =function (cwd, m) {
    const  me = this;
    let external={};
    for (let k in m.externalLib ){
        external[k] = m.externalLib[k].id
    }
    const modules = {};
    me.modules = modules;
    me.module = m;
    let inputOptions;
    const getInputOptions =function(){
        let input =  path.resolve(me.module.path,me.module.main);
        let output =  path.resolve(me.module.path,me.module.outputDir,'./output.js');
        let inputOptions = {
            input:input,
            onwarn: function (message) {
                // Suppress this error message... there are hundreds of them. Angular team says to ignore it.
                // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
                if (message.code =="THIS_IS_UNDEFINED") {
                    return;
                }
                console.error(message);
            },
            external: Object.keys(external),
            plugins: [
                JavascriptPlugin(me.module),
                TypescriptPlugin(me.module),
                SassPlugin(me.module),
                ImagePlugin(me.module),
                BabelPlugin(me.module),
                replace({
                    'process.env.NODE_ENV': JSON.stringify( 'production' )
                })
            ],
            output:{
                format: 'iife',
                globals: external,
                sourcemap:true,
                file: output
            }
        };
        return inputOptions;
    }
    const init =function () {
        inputOptions = getInputOptions();
        for (let _m  of  m.modules){
            me.modules[_m.id] = _m;
        }
        me.modules[m.id] = m;
    }
    init();
    createBuffered= function(fn, buffer, scope, args) {
        var timerId;
        return function() {
            var callArgs = args || Array.prototype.slice.call(arguments, 0),
                me = scope || this;
            if (timerId) {
                clearTimeout(timerId);
            }
            timerId = setTimeout(function(){
                fn.apply(me, callArgs);
            }, buffer);
        };
    },
    me.compile=createBuffered(function () {
            rollup.rollup(inputOptions).then(function (bundle) {
                bundle.write(inputOptions.output).then(function () {
                });
            }).catch(function (e){
                console.error(e);
            });
        },3000,this);
    me.watcher=function () {
        let  modules = me.module.modules.concat([me.module])
        for  (let m  of modules){
            let options  = {
                cwd: m.path
            };
            let patterns = m.watcher.include;

            const gaze = new Gaze(patterns,options , function() {

                // Files have all started watching
                // watcher === this

                // Get all watched files
                var watched = this.watched();

                // On file changed
                this.on('changed', function(filepath) {
                    console.log(filepath + ' was changed');
                    me.compile();
                });

                // On file added
                this.on('added', function(filepath) {
                    console.log(filepath + ' was added');
                    me.compile();
                });

                // On file deleted
                this.on('deleted', function(filepath) {
                    console.log(filepath + ' was deleted');
                    me.compile();
                });

                // On changed/added/deleted
                this.on('all', function(event, filepath) {
                    me.compile();
                });

                // Get watched files with relative paths
                var files = this.relative();
            });
        }
        me.compile();
        //create a server object:
        let port = 4200;
        http.createServer(function (req, res) {
            const INDEX = function (){
                let htmlPath =path.resolve(me.module.path,"./public/index.html")
                let buffer = fs.readFileSync(htmlPath);
                const $ = cheerio.load(buffer);
                // $('<script src="node_modules/react/umd/react.development.js"></script>').appendTo('head');
                // $('<script src="node_modules/react-dom/umd/react-dom.development.js"></script>').appendTo('head');
                // $('<script src="node_modules/react-router/umd/react-router.js"></script>').appendTo('head');
                // $('<script src="node_modules/react-router-dom/umd/react-router-dom.js"></script>').appendTo('head');
                // $('<script src="node_modules/prop-types/prop-types.min.js"></script>').appendTo('head');
                $('<script src="/node_modules/axios/dist/axios.js"></script>').appendTo('head');
                $('<script src="/node_modules/react/umd/react.development.js"></script>').appendTo('head');
                $('<script src="/node_modules/react-dom/umd/react-dom.development.js"></script>').appendTo('head');
                $('<script src="/node_modules/react-router/umd/react-router.js"></script>').appendTo('head');
                $('<script src="/node_modules/react-router-dom/umd/react-router-dom.js"></script>').appendTo('head');
                $('<script src="/node_modules/prop-types/prop-types.min.js"></script>').appendTo('head');

                $('<script src="/dist/output.js"></script>').appendTo('body');
                res.write($.html()); //write a response to the client
            }
            const FILE = function (p) {
                if ( fs.existsSync(p)){

                    let buffer = fs.readFileSync(p);
                    res.write(buffer);

                }
            }
            if (req.url=="/"){
                INDEX();
            }else  if (req.url.indexOf("/dist")==0){
                let p = path.resolve(me.module.path,"." + req.url);
                FILE(p);
            }else  if (req.url.indexOf("/packages")==0){
                let rp =new RollupPlugin(me.module);
                let b =req.url.replace(/^\/packages\//,"").split("?")[0];
                let p =rp.getOutputFile(b);
                let contentType =mime.lookup(p);

                if (contentType){
                    res.setHeader('content-type', contentType);
                }
                FILE(p);
            }else if (req.url.indexOf("/node_modules")==0){
                let p = path.resolve(me.module.path,"." + req.url);
                FILE(p);
            } else {
                let p1 = path.resolve(me.module.path,"./node_modules" ,"." + req.url);
                if (fs.existsSync(p1)){
                    FILE(p1);
                }else {
                    INDEX();
                }
            }
            res.end(); //end the response

        }).listen(port); //the server object listens on port 8080
    };

}

