
const RollupPlugin =require('./rollup_plugin');
const path =require('path');
const fs =require('fs');
const {createFilter} = require('rollup-pluginutils');
const sass = require('node-sass');
const SassPlugin =function (duffProject ) {
    let   rp =new RollupPlugin(duffProject);
    const me = this;
    const filterScss = function(p){
        let b = /\.(css)|(scss)|(sass)$/.test(p);
        return b;
    }

    let hasQuote = /^\s*('|")/;
    replaceCssUrl=function(css,mapFunc){
      return   [
            /(url\s*\()(\s*')([^']+?)(')/gi,
            /(url\s*\()(\s*")([^"]+?)(")/gi,
            /(url\s*\()(\s*)([^\s'")].*?)(\s*\))/gi].reduce(function (css, reg, index) {
          return css.replace(reg, function (all, lead, quote1, path, quote2) {
              var ret = mapFunc(path, quote1);
              if(hasQuote.test(ret) && hasQuote.test(quote1)) { quote1=quote2=''; }
              return lead + quote1 + ret + quote2
          })
      }, css)
    }
    
    return {
        resolveId: function resolveId ( importee, importer ) {
            if (!filterScss(path.resolve(importee)))
                return;
            let file = rp.getOutputFile(importee, importer);
            if (fs.existsSync(file))
                return file;
        },
        load: function load (id) {
            if (!filterScss(path.resolve(id)))
                return;
            return fs.readFileSync(id).toString();
        },
        transform: function transform ( code, id ) {
            if (!filterScss(id))
                return;


             // OR
             let r = sass.renderSync({
                file: id,
                data: code,
                outputStyle: 'compressed',
                importer: function(url, prev, done) {

                    //console.log(url, prev, done);
                    // // url is the path in import as is, which LibSass encountered.
                    // // prev is the previously resolved path.
                    // // done is an optional callback, either consume it or return value synchronously.
                    // // this.options contains this options hash
                    // someAsyncFunction(url, prev, function(result){
                    //     done({
                    //         file: result.path, // only one of them is required, see section Special Behaviours.
                    //         contents: result.data
                    //     });
                    // });
                    // // OR
                    // var result = someSyncFunction(url, prev);
                    let file;
                    if (url[0]=="~"){
                        url= url.substr(1);
                         file = rp.getOutputFile(url, prev);
                    }else {
                         file = rp.getOutputFile(url, prev);
                    }
                    if (!fs.existsSync(file)){

                        if (fs.existsSync(file+".scss")){

                            file=  file+".scss"
                        }
                    }

                    let contents = fs.readFileSync(file).toString();
                    return {file: file, contents:contents  };
                }
            });
            let css = replaceCssUrl(r.css.toString() ,function (v) {
                let file = rp.getOutputFile(v, id);
                for (let module  of  duffProject.modules) {
                    if (file.indexOf( module.path)==0){
                        let bb= "/packages/"+module.id+""+ file.replace(module.path,"").replace(/\\/gi,"/");
                        return bb;
                    }
                }
                if (file.indexOf( duffProject.path)==0){
                   let bb= duffProject.id+""+ file.replace(duffProject.path,"").replace(/\\/gi,"/");
                   return "/packages/" +bb;
                }
                return v
            })
            let ccode = "import {loadCss} from \"@atomicburst/core\";\n";
            ccode    += "export default loadCss(" + JSON.stringify(css) + ");";
            return {
                map: JSON.stringify({
                    "version": 3,
                    "file": id,
                    "sourceRoot": "",
                    "sources": [id],
                    "names": [],
                    "mappings":";;"
                }),
                code: ccode
            };
        }
    };
};
module.exports = SassPlugin;