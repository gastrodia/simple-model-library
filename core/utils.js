/**
 * Created by Administrator on 2014/7/21.
 */

var fs = require('fs');
var path = require('path');

exports.mkdirSync = function(dirpath,mode){
    dirpath.split('\/').reduce(function(pre, cur) {
        var p = path.resolve(pre, cur);
        if(!fs.existsSync(p)) fs.mkdirSync(p, mode || 0755);
        return p;
    }, __dirname);
}

