/**
 * Created by Administrator on 2014/7/21.
 */

var fs = require('fs');
var path = require('path');
var walk = require('walk');
var config = require('./config');

exports.mkdirSync = function(dirpath,mode){
    dirpath.split('\/').reduce(function(pre, cur) {
        var p = path.resolve(pre, cur);
        if(!fs.existsSync(p)) fs.mkdirSync(p, mode || 0755);
        return p;
    }, __dirname);
}

exports.registerPlugins = function(app){
    var pluginsDir = path.join(config.LPR,"plugins");
    var walker = walk.walk(pluginsDir);
    walker.on("directories",function (root, dirStatsArray, next) {
        //console.log(dirStatsArray);
        for(var i=0;i<dirStatsArray.length;i++){
            var name=dirStatsArray[i].name;
            if(name.substring(0,1)!="_"){
                var plugin = require(path.join(pluginsDir,name));
                plugin.init(app);
            }
        }

    });
};

exports.registerPlugin = function(app,pluginDir){
    var pluginName = path.basename(pluginDir);
    //register model
    app.plugins = app.plugins || {};


};

exports.walkRegister = function(obj,moduleDir,callback,excepts){
    var walker = walk.walk(moduleDir);
    walker.on('file',function(root,stat,next){
        var filename = stat.name;

        if(isRunnable(filename) && !isInExcepts(filename)){
            var module = require('../../' + moduleDir + filename);
            callback(module);
        }
        next();
    });

    var isInExcepts = function(filename){
        var val = false;
        for(var i in excepts){
            if(excepts[i] == filename){
                val = true;
                break;
            }
        }
        return val;
    }

    var isRunnable = function(filename){
        return path.extname(filename)=== '.js';
    }
}