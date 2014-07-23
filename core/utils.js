/**
 * Created by Administrator on 2014/7/21.
 */

var fs = require('fs');
var path = require('path');
var walk = require('walk');


/*
* 用以创建深层目录 ，类似于linux下的 mkdirp
* */
exports.mkdirSync = function(dirpath,mode){
    dirpath.split('\/').reduce(function(pre, cur) {
        var p = path.resolve(pre, cur);
        if(!fs.existsSync(p)) fs.mkdirSync(p, mode || 0755);
        return p;
    }, __dirname);
}

exports.walkHelper = function(dir,callback,excepts){
    var walker = walk.walk(dir);
    walker.on('file',function(root,stat,next){
        var filename = stat.name;
        if(!isInExcepts(filename)){
            callback(root,filename);
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
}

exports.loadHelper = function(moduleDir,callback,excepts){
    var walker = walk.walk(moduleDir);
    walker.on('file',function(root,stat,next){
        var filename = stat.name;

        if(isRunnable(filename) && !isInExcepts(filename)){
            var module = require(path.join(moduleDir ,filename));
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

