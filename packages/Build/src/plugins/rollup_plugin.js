const path = require('path');
const fs = require('fs');
const RollupPlugin = function (duffProject) {
    this.getModule = function (id) {

        if (duffProject.id[0] == "@") {
            let array1 = duffProject.id.split("/");
            let array2 = id.split("/");
            if (
                array1[0] == array2[0] &&
                array1[1] == array2[1]

            ) {
                return duffProject;
            }
        }

        for (let module  of  duffProject.modules) {
            if (module.id[0] == "@") {
                let array1 = module.id.split("/");
                let array2 = id.split("/");
                if (
                    array1[0] == array2[0] &&
                    array1[1] == array2[1]

                ) {
                    return module;
                }
            }
        }
    }
    this.getOutputFile = function (importee, importer) {
        let file = importee;
        if (path.isAbsolute(importee)) {
            return importee
        } else if (importee.indexOf("./") == 0||importee.indexOf("../") == 0) {
            file = path.resolve(path.dirname(importer), importee);
        } else {
            let m = this.getModule(importee);
            if (m) {
                let g = importee.replace(m.id, "").split("?")[0];
                if (g[0]=="/"){

                    g=g.slice(1);
                }
                file = path.resolve(m.path, g);
            } else {
                    let p = path.resolve(duffProject.path, "node_modules", file);

                    if (fs.existsSync(p)) {
                        return p;
                    }
            }
        }

        return file;
    }
}
module.exports = RollupPlugin;