/**
 * Created by Administrator on 2014/6/5.
 */

define([],function(){
    var CommonLoader = function(){

    };

    CommonLoader.prototype.load = function(id,cb){
        getLoadInfo(id,function(obj,index){
            var analyzeResult = loadAnalyze(obj,index);
            if(analyzeResult.error){
                console.log(analyzeResult.error);
            }
            if(analyzeResult.loader){
                analyzeResult.loader(function(model){
                    model.serverId = id;
                    cb(model);
                });
            }
        });
    };

    var Structures = {
        "桌子":["3d_object"],
        "椅子":["3d_object"],
        "横幅":["2d_object"],
        "地毯":["2d_object"],
        "厅内装饰":["3d_object"],
        "壁画":["2d_object"],
        "墙纸":["2d_object"],
        "其他模型":["3d_object","2d_object"]
    }


    var object3DFormats = ['obj','dae','js'];
    var object2DFormats = ['jpg','jpeg','png'];



    var fileLoaders = {
        "image":{
            loader:function(obj,url,index,callback){
                var model;
                var material = new THREE.MeshLambertMaterial({
                    map: THREE.ImageUtils.loadTexture(url),
                    side: THREE.DoubleSide
                });
                var geometry=new THREE.PlaneGeometry(500,500);
                var plane = new THREE.Mesh( geometry,material);


                plane.imgfile = url;
                callback(plane);
            }
        },
        "obj":{
            loader:function(obj,url,index,callback){
                var obj_url = url;
                var mtl_url = obj_url.split(".obj")[0] + ".mtl";


                require(["threex"],function(THREE){
                   require(["three/loaders/MTLLoader"],function(){
                       require(["threex","three/loaders/OBJMTLLoader"],function(){
                           var loader = new THREE.OBJMTLLoader();
                           loader.load(obj_url, mtl_url,function(model){
                               callback(model);
                           });
                       });
                   })
                });
            }
        },
        "dae":{
            loader:function(obj,url,index,callback){
                require(["threex","three/loaders/ColladaLoader"],function(THREE){
                    var loader = new THREE.ColladaLoader();
                    loader.options.convertUpAxis = true;
                    loader.load(url, function ( collada ) {

                        dae = collada.scene;
                        /*skin = collada.skins[ 0 ];

                         dae.scale.x = dae.scale.y = dae.scale.z = 0.002;
                         dae.updateMatrix();*/

                        callback(dae);

                    } );
                })

            }
        },
        "js":{
            loader:function(obj,url,index,callback){
                var jsonLoader = new THREE.JSONLoader();
                jsonLoader.load(url,function(geometry, materials){
                    for (var i = 0; i < materials.length; i++) {
                          materials[i].side =THREE.DoubleSide;
                    }
                    var material = new THREE.MeshFaceMaterial(materials);
                    var mesh = new THREE.Mesh(geometry, material);
                    callback(mesh);
                });
            }
        }
    };

    function loadAnalyze(obj,index){
        var dnaList = Structures[obj.type];
        var result = {};
        result.loader = null;


        //递归index 确定文件格式 ，以及模型加载路径
        var files = [];
        function walk(o,path){
            for(var i in o){
                var childObject = o[i];
                var childPath = path + "/" + i;
                if(childObject){
                    walk(childObject,childPath);
                }else{
                    files.push(childPath);
                }
            }
        }
        walk(index,"");

        //2d_object只是一张图片

        for(var i in dnaList){
            var dna = dnaList[i];
            if(dna == "3d_object"){
                var files_3d = get3DFiles(files);
                if(files_3d.length == 0){
                    result.error = "3d_object don't have any objects!";
                }else if(files_3d.length == 1){
                    var file = files_3d[0];
                    result.loader = loaderFactory(obj,file,index);
                    break;
                }
            }else if(dna == "2d_object") {
                    result.loader = loaderFactory(obj, null, index);
            }
        }



        return result;
    }

    function loaderFactory(obj,file,index){

        if(is2DObject(obj.type)){
            url = obj.path;
            var loader = function(callback){
                fileLoaders["image"].loader(obj,url,index,callback);
            };
            return loader;
        }else{
            var ext = getFileExt(file);
            var url = obj.path + file;
            var loader = function(callback){
                fileLoaders[ext].loader(obj,url,index,callback);
            };
            return loader;
        }

    }



    function is2DFile(file){
        var ext = getFileExt(file);
        var is = false;
        for(var i in object2DFormats){
            if(object2DFormats[i] == ext){
                is = true;
                break;
            }
        }
        return is;
    }

    function is3DFile(file){
        var ext = getFileExt(file);
        var is = false;
        for(var i in object3DFormats){
            if(object3DFormats[i] == ext){
                is = true;
                break;
            }
        }
        return is;
    }

    function get2DFiles(files){
        var files_2d = [];
        for(var i in files){
            var file = files[i];
            if(is2DFile(file)){
                files_2d.push(file);
            }
        }
        return files_2d;
    };

    function get3DFiles(files){
        var files_3d = [];
        for(var i in files){
            var file = files[i];
            if(is3DFile(file)){
                files_3d.push(file);
            }
        }
        return files_3d;
    };

    function getFileExt(path){
        var ext = path.split(".")[1];
        return ext;
    }


    function is2DObject(type){
        if(type == "横幅" || type == "地毯" || type == "壁画" || type == "墙纸"){
            return true;
        }else{
            return false;
        }
    }

    function getLoadInfo(id,cb){
        require(['jquery'],function($){
            $.get("/api/ob/" + id,function(obj){
                if(is2DObject(obj.type)){

                    cb(obj,{});
                }else{
                    var __index = obj.path + "/__index.json";
                    $.get(__index,function(data){
                        cb(obj,data);
                    })
                }

            });
        });
    }


    return CommonLoader;
});
