/**
 * Created by ELatA on 2014/4/16.
 */

require(["threex","threex-defaultworld","dat.gui","app/CommonLoader","app/CommonUtils"],function(THREE,DefaultWorld,x3,CommonLoader,utils){


    world = new DefaultWorld();
    //world.enableRotateCube = true;
    world.run();

    var ambientLight = new THREE.AmbientLight(0xdddddd);
    var directionalLight = new THREE.DirectionalLight( 0xffffff );
    world.add(ambientLight);
    world.add(directionalLight);

    world.camera.position.set(-62,45,1);
    var query = utils.receiveQuery();

    var loader = new CommonLoader();
    loader.load(query.id,function(mesh){
        //world.add(mesh);
        mesh.lookAt(world.camera.position);
        world.add(mesh);
        //world.children.push(mesh);
        console.log(mesh);
        console.debug(world);
        //window.open( world.renderer.domElement.toDataURL( 'image/png' ), 'screenshot' );
    });



    //根据id获得物体模型

});


