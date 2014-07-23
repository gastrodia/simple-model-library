/**
 * Created by ELatA on 2014/4/14.
 */
define(["threex","threex-controls"],function(THREE){
    THREE.DefaultWorld = function(){
        this.camera = null;
        this.renderer = null;
        this.update = null;
        this.controls = null;
        this.enableRotateCube = false;
        this.debug = true;
        THREE.Scene.apply(this);
    };
    THREE.DefaultWorld.prototype = Object.create(THREE.Scene.prototype);
    THREE.DefaultWorld.prototype.constructor = THREE.DefaultWorld;
    THREE.DefaultWorld.prototype.run = function(){
        var world = this;
        if(!world.camera){
            var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
            camera.position.z = 5;
            world.camera = camera;
        }
        if(!this.renderer){
            var renderer =  new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);
            world.renderer = renderer;
        }
        if(!world.controls){
            var orbitControls = new THREE.OrbitControls(this.camera);
            orbitControls.autoRotate = false;
            world.controls = orbitControls;
        }
        if(world.enableRotateCube){
            var cube = new RotateCube();
            world.add(cube);
            if(world.update){
                var _update = world.update;
                world.update = function(){
                    cube.update();
                    _update();
                }
            }else{
                world.update = function(){
                    cube.update();
                }
            }
        }



        if(world.debug){
            require(["threejs-stats"],function(){
                var stats = new Stats();
                stats.setMode(0);
                stats.domElement.style.position = 'absolute';
                stats.domElement.style.left = "0px";
                stats.domElement.style.top = "0px";
                document.body.appendChild(stats.domElement);
                world.debugUpdate = function(){
                    stats.update();
                }
            });
        }

        var clock = new THREE.Clock();
        var render = function () {
            requestAnimationFrame(render);
            var delta = new clock.getDelta();
            world.controls.update(delta);
            if(world.update){
                world.update();
            }
            if(world.debugUpdate){
                world.debugUpdate();
            }
            world.renderer.render(world, world.camera);
        };

        render();
    };

    var RotateCube = function(){
        var geometry = new THREE.CubeGeometry(1,1,1);
        var material = new THREE.MeshBasicMaterial({color: Math.random()*0xffffff});
        THREE.Mesh.apply(this, [geometry,material]);
    }
    RotateCube.prototype = Object.create(THREE.Mesh.prototype);
    RotateCube.prototype.constructor = RotateCube;
    RotateCube.prototype.update = function(){
        this.rotation.x += 0.1;
        this.rotation.y += 0.1;
    }

    return THREE.DefaultWorld;
});