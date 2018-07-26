const RollupPlugin = require('./rollup_plugin');
const path = require('path');
const fs = require('fs');
const {createFilter} = require('rollup-pluginutils');
const ImagePlugin = function (duffProject) {
    let rp = new RollupPlugin(duffProject);
    const me = this;
    const filterImage = createFilter(['**/*.svg', '**/*.png', '**/*.jpg'], []);
    return {
        load: function load(id) {
            if (!filterImage(id))
                return;
            return id;
        },
        transform: function transform(code, id) {
            if (!filterImage(id))
                return;

            let file = rp.getOutputFile(id);
            let _file="";
            for (let module  of  duffProject.modules) {
                if (file.indexOf( module.path)==0){
                    let bb= "/packages/"+module.id+""+ file.replace(module.path,"").replace(/\\/gi,"/");
                    _file= bb;
                }
            }
            if (file.indexOf( duffProject.path)==0){
                let bb= "/packages/" +duffProject.id+""+ file.replace(duffProject.path,"").replace(/\\/gi,"/");
                _file= bb;
            }
            let ccode = "export default "+JSON.stringify(_file )+";";
            return {
                map: JSON.stringify({
                    "version": 3,
                    "file": id,
                    "sourceRoot": "",
                    "sources": [id],
                    "names": [],
                    "mappings":";"
                }),
                code: ccode

            };
        }
    };
};
module.exports = ImagePlugin;