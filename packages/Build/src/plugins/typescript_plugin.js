const RollupPlugin = require('./rollup_plugin');

const  presetEs2015 = require("@babel/preset-es2015").default;
//const  presetReact = require("@babel/preset-react").default;
//const  presetStage3 = require("@babel/preset-stage-3").default;
//const  presetTypescript = require("@babel/preset-typescript").default;
//const  pluginProposalTransformClassProperties = require("@babel/plugin-proposal-class-properties").default;
//const  pluginProposalTransformFlowComents = require("@babel/plugin-transform-flow-comments").default;
//const  pluginProposalDecorators = require("@babel/plugin-proposal-decorators").default;
//const  presetEnv = require("@babel/preset-env").default;
const  babel = require("@babel/core");


const path = require('path');
const fs = require('fs');
const ts = require('typescript');
const {createFilter} = require('rollup-pluginutils');
const TypescriptPlugin = function (duffProject) {
    let rp = new RollupPlugin(duffProject);
    const filterTsc = function(p){
        let b = /\.(tsx)|(ts)$/.test(p);
        return b;
    }
    return {
        resolveId: function resolveId(importee, importer) {
            let file = rp.getOutputFile(importee, importer);
            let _file;
            if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
                if (fs.existsSync(_file = (file + path.sep + "index.ts"))) {
                    return _file;
                } else if (fs.existsSync(_file = (file + path.sep + "index.tsx"))) {
                    return _file;
                }
            } else {
                if (filterTsc(_file = file) && fs.existsSync(_file)) {
                    return _file
                } else if (filterTsc(_file =  (file + ".tsx")) &&fs.existsSync(_file) ){
                    return _file;
                } else if (filterTsc(_file =  (file + ".ts")) &&fs.existsSync(_file )) {
                    return _file;
                }
            }
        },
        load: function load(id) {
            if (!filterTsc(id))
                return;
            return fs.readFileSync(id).toString();
        },
        transformBundle:function(code,source){

            let result= babel.transform(code,{
                  presets:[presetEs2015],
                  sourceMaps:true,
                  filename :source.file
            });


            return {
                code: result.code,
                map:result.map
            };

        },
        transform: function transform(code, id) {
            if (!filterTsc(id))
                return;


                // let result= babel.transform(code,{
                //     presets:[presetTypescript,presetReact],
                //     plugins:[pluginProposalTransformClassProperties,[pluginProposalDecorators,{"legacy": true}],pluginProposalTransformFlowComents],
                //     sourceMaps:true,
                //     filename :id
                // })

                // return {
                //     code: result.code,
                //     map:result.map
                // };
                let result = ts.transpileModule(code, {
                    fileName:id,
                    compilerOptions: {
                        module: ts.ModuleKind.ESNext,
                        target: ts.ScriptTarget.ESNext,
                        lib: ["es6", "dom"],
                        sourceMap: true,
                        declaration: true,
                        jsx: ts.JsxEmit.React,
                        moduleResolution: ts.ModuleResolutionKind.NodeJs,
                        forceConsistentCasingInFileNames: false,
                        noImplicitReturns: false,
                        noImplicitThis: false,
                        noImplicitAny: false,
                        strictNullChecks: false,
                        experimentalDecorators: true,
                        suppressImplicitAnyIndexErrors: true,
                        noUnusedLocals: false
                    }
                });
                return {
                    code: result.outputText,
                    map:result.sourceMapText
                };

        }
    };
}
module.exports = TypescriptPlugin;