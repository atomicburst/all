const RollupPlugin = require('./rollup_plugin');

const path = require('path');
const fs = require('fs');
const {createFilter} = require('rollup-pluginutils');
const JavascriptPlugin = function (duffProject) {
    let rp = new RollupPlugin(duffProject);
    const filterJs = function(p){
        let b = /\.(js)$/.test(p);
        return b;
    }
    return {
        resolveId: function resolveId(importee, importer) {
            let file = rp.getOutputFile(importee, importer);



            if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
                let indexPackage= file + path.sep + "package.json";
                if (fs.existsSync(indexPackage)) {
                    let json= require(indexPackage);
                    if (json.main){
                        let  m =path.resolve(file,json.main);

                        if (fs.existsSync(m)) {
                            console.log(m)
                            return m;
                        }
                    }
                }


                let indexJs= file + path.sep + "index.js";
                if (fs.existsSync(indexJs)) {
                    return indexJs;
                }



            } else {
                let _file;
                if (filterJs(_file = file) && fs.existsSync(_file)) {
                    return _file
                } else if (filterJs(_file =  (file + ".js")) &&fs.existsSync(_file )) {
                    return _file;
                }
            }
        }
    };
}
module.exports = JavascriptPlugin;