module.exports =function (config) {
    this.id = config.id;
    this.path = config.path;
    this.main = config.main;
    this.modules = config.modules;
    this.outputDir = config.outputDir;
    this.plugins = config.plugins;
    this.watcher = config.watcher;
    this.externalLib = config.externalLib;
    if (   this.plugins){
        for (let _p  of    this.plugins){
           _p.module = this;
           _p.init();
        }
    }
}