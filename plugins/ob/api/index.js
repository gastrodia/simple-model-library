/**
 * Created by Administrator on 2014/7/23.
 */



/**
 * Created by gastrodia on 14-4-25.
 */
var fs = require('fs');
var path = require('path');
var async = require('async');
var AdmZip = require('adm-zip');



module.exports = function(app){

    function Ob(){
        return app.plugins['ob'].model['ob'];
    }

    var config = app.core.config;

    /*
     * 列出物件
     * */
    app.get('/api/ob/:type/list',function(req,res){


        var type = req.params.type;

        var condition = {};
        if(type!="all"){
            condition.type = type;
        }
        Ob().find().where(condition).sort({ updatedAt: 'desc' }).exec(function(err,objects){
                if (err) throw err;
                res.json(objects);
        });


    });

    /*
     * 上传物件
     * */

    function is2DObject(type){
        if(type == "横幅" || type == "地毯" || type == "壁画" || type == "墙纸"){
            return true;
        }else{
            return false;
        }
    }

    app.post('/api/ob/upload',function(req,res){




            var obName = req.body.obName;
            var obType = req.body.obType;

            var obFilePath =  req.files.obFile.path;
            var obThumbPath =  req.files.obThumb.path;

            var tmpUploadPath = config.LPR;
            var targetUploadPath = config.uploadPath;


            var tmpObFilePath = obFilePath;
            var targetObFilePath;

            if(is2DObject(obType)){
                targetObFilePath  = path.join(targetUploadPath,path.basename(obFilePath));
            }else{
                targetObFilePath = path.join(targetUploadPath,path.basename(obFilePath).split('.zip')[0]);
                var zip = new AdmZip(tmpObFilePath);
                zip.extractAllTo(targetObFilePath);
            }

            var tmpObThumbPath = obThumbPath;
            var targetObThumbPath = path.join(targetUploadPath,path.basename(obThumbPath));


            async.auto({
                reIndexObFile:function(cb){

                    if(is2DObject(obType)){
                        cb(null,{});
                    }else{
                        var jsonTree = {};

                        function treeWalk(path,record){
                            var dirList = fs.readdirSync(path);
                            dirList.forEach(function(item){
                                if(fs.statSync(path + '/' + item).isDirectory()){
                                    record[item] = {};
                                    treeWalk(path + '/' + item,record[item]);
                                }else{
                                    record[item] = 0;
                                }
                            });
                        }

                        treeWalk(targetObFilePath,jsonTree);
                        fs.writeFile(path.join(targetObFilePath,'./__index.json'),JSON.stringify(jsonTree),function(err){
                            if(err){
                                throw err;
                            }else{
                                cb(null,jsonTree);
                            }
                        });
                    }
                },
                removeTmpObFile:function(cb){
                    if(is2DObject(obType)){
                        fs.rename(tmpObFilePath,targetObFilePath,function(err){
                            if(err) throw err;
                            cb(null);
                        })
                    }else{
                        fs.unlink(tmpObFilePath,function(err){
                            if(err) throw err;
                            cb(null);
                        });
                    }

                },
                moveObThumb:function(cb){
                    fs.rename(tmpObThumbPath,targetObThumbPath,function(err){
                        if(err) throw err;
                        cb(null);

                    })
                },
                dbObRecord:['reIndexObFile','moveObThumb',function(cb,results){


                    var filePath = path.basename(obFilePath);
                    if(!is2DObject(obType)){
                        filePath = path.basename(obFilePath).split(".zip")[0]
                    }

                    Ob().create({
                        path:"/uploads" + "/" + filePath,
                        type:obType,
                        name:obName,
                        thumb_path:"/uploads" + "/" + path.basename(obThumbPath)
                    }).done(function(err,object){
                        //logging.log("用户 " + user.username + " 添加了模型 " + object.name);
                        cb(null,object);
                    })
                }]
            },function(err,results){

                res.json({ok:true});
            });

    });

    app.post('/api/ob/:object_id',function(req,res){
        var objectId = req.params.object_id;

            var obName = req.body.obName;
            var obType = req.body.obType;

            var task = {};
            var record_depTask = [];

            var tmpUploadPath = config.tmpUploadPath;
            var targetUploadPath = config.targetUploadPath;

            var obThumbPath = './' + req.files.obThumb.path;
            var obFilePath =  req.files.obFile.path;

            var hasUploadThumb = false;
            (function(){
                var split = obThumbPath.split(".");
                var ext = split.pop();
                if(ext == "png" || ext == "jpg" || ext == "jpeg"){
                    hasUploadThumb = true;
                }
            })();

            var hasUploadModel = false;
            var hasUploadImage = false;
            (function(){
                var split = obFilePath.split(".");
                var ext = split.pop();
                if(ext == "zip"){
                    hasUploadModel = true;
                }
                if(ext == "png" || ext == "jpg" || ext == "jpeg"){
                    hasUploadImage = true;
                }
            }());

            if(hasUploadThumb){
                var tmpObThumbPath = path.join(tmpUploadPath,obThumbPath);
                var targetObThumbPath = path.join(targetUploadPath,obThumbPath);
                task.moveObThumb = function(cb){
                    fs.rename(tmpObThumbPath,targetObThumbPath,function(err){
                        if(err) throw err;
                        cb(null);

                    })
                };
                record_depTask.push('moveObThumb');
            }

            if(hasUploadImage){
                var tmpObFilePath = path.join(tmpUploadPath,obFilePath);
                var targetObFilePath = path.join(targetUploadPath,obFilePath);
                task.moveObFile = function(cb){
                    fs.rename(tmpObFilePath,targetObFilePath,function(err){
                        if(err) throw err;
                        cb(null);
                    })
                }
                record_depTask.push('moveObFile');
            }

            if(hasUploadModel){
                var tmpObFilePath = path.join(tmpUploadPath,obFilePath);
                var targetObFilePath = path.join(targetUploadPath,obFilePath).split('.zip')[0];
                var zip = new AdmZip(tmpObFilePath);
                zip.extractAllTo(targetObFilePath);
                task.removeTmpObFile = function(cb){
                    fs.unlink(tmpObFilePath,function(err){
                        if(err) throw err;
                        cb(null);
                    });
                }
                task.reIndexObFile = function(cb){

                    var jsonTree = {};

                    function treeWalk(path,record){
                        var dirList = fs.readdirSync(path);
                        dirList.forEach(function(item){
                            if(fs.statSync(path + '/' + item).isDirectory()){
                                record[item] = {};
                                treeWalk(path + '/' + item,record[item]);
                            }else{
                                record[item] = 0;
                            }
                        });
                    }

                    treeWalk(targetObFilePath,jsonTree);
                    fs.writeFile(path.join(targetObFilePath,'./__index.json'),JSON.stringify(jsonTree),function(err){
                        if(err){
                            throw err;
                        }else{
                            cb(null,jsonTree);
                        }
                    });

                    task.removeTmpObFile = function(cb){
                        fs.unlink(tmpObFilePath,function(err){
                            if(err) throw err;
                            cb(null);
                        });
                    }
                }

                record_depTask.push('reIndexObFile');

            };


            record_depTask.push(function(cb,results){

                Ob().findOne().where({id:objectId}).exec(function(err,object){
                    object.name = obName;
                    object.type = obType;
                    if(hasUploadThumb){
                        object.thumb_path = obThumbPath;
                    }
                    if(hasUploadModel){
                        object.path = obFilePath.split(".zip")[0];
                    }
                    if(hasUploadImage){
                        object.path = obFilePath;
                    }
                    object.save(function(err,object){
                        //logging.log("用户 " + user.username + " 修改了模型 " + object.name);
                        cb(null,object);
                    });

                });
            });
            task.dbObRecord = record_depTask;



            async.auto(task,function(err,results){
                res.json({ok:true});
            });


    })

    /*
     * 获取物件
     * */
    app.get('/api/ob/:object_id',function(req,res){
        var object_id = req.params.object_id;
        if(object_id){
            Ob().findOne().where({id:object_id}).exec(function(err,object){
                res.json(object);
            });
        }else{
            res.json({error:"Error Search!"});
        }
    });

    /*
     * 删除物件
     * */
    app.delete("/api/ob/:object_id",function(req,res){

        var id = req.params.object_id;
        Ob().findOne().where({id:id}).exec(function(err,ob){
            Ob().destroy({id:id}).exec(function(err,objs){
                //logging.log("用户 " + user.username + " 删除了模型 " + ob.name);
                res.json({ok:true});
            });
        });

    });
}