const  babel = require("@babel/core");




const { transform } = babel;
const { mkdirsSync } = require('fs-extra');
const fs = require('fs');

const path = require('path');


const BabelPlugin =function (_m ,duffProject ) {
    return {
        ongenerate   : function ( dd, otb ) {
          //  let dir = path.dirname(dd.file);
          //  if (!fs.existsSync(dir))
          //   mkdirsSync(dir);
          // let b= babel.transform(otb.code,{
          //       presets:[presetEs2015],
          //       sourceMaps:true,
          //       filename :dd.file,
          //       inputSourceMap:otb.map
          // });
          // fs.writeFileSync(path.resolve(dir,"./output-es2015.js")  ,b.code)
          // fs.writeFileSync(path.resolve(dir,"./output-es2015.js.map")  ,JSON.stringify(b.map))
        }
    };
};
module.exports = BabelPlugin;