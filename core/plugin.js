/**
 * Created by Administrator on 2014/7/23.
 */
var fs = require('fs');
var path = require('path');
var walk = require('walk');
var config = require('./config');
var utils = require('./utils');
var logger = require('./log').logger;

var registerPlugins = function(app){
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

var registerPlugin = function(app,pluginDir){
    var pluginName = path.basename(pluginDir);
    app.plugins = app.plugins || {};
    var plugin = {};

    var walker = walk.walk(pluginDir);
    walker.on("directories",function(root, dirStatsArray,next){
        for(var i=0;i<dirStatsArray.length;i++){
            var name=dirStatsArray[i].name;
            var dir = path.join(root,name);
            switch(name){
                case "model":
                    var model = {};
                    utils.loadHelper(dir,function(Collection){
                        new Collection(config.ormConfig,function(err,collection){
                            if(!err){
                                model[collection._tableName] = collection;
                                console.log(collection._tableName + " collection load success!");
                            }else{
                                logger.error(err);
                            }
                        });
                    });
                    plugin.model = model;
                    break;
                case "view":/*自动将view下的html文件注册为路由，使用view而不是完全的静态页面，在于方便模板复用，同时保留后端的控制能力*/
                    utils.walkHelper(dir,function(root,filename){
                        var url = "/" + pluginName + '/' + filename.split(".html")[0];
                        console.log("view " + url + " register success!");
                        app.get(url,function(req,res){
                            res.render(pluginName + "/view/" + filename);
                        });
                    })  ;
                    break;
                case "api":
                    var api = require(path.join(root,"api"));
                    api(app);
                    break;
            }
        }
    });

    app.plugins[pluginName] = plugin;
};


exports.init = registerPlugins;

exports.registerPlugin = registerPlugin;