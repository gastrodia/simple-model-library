/**
 * Created by gastrodia on 14-4-2.
 */
require.config({
    baseUrl: "/lib",
    map: {
        "*": {
            css: "components/require-css/css",
            text: "requirejs-text"
        }
    },
    shim: {
        jquery: {
            exports: "jquery"
        },
        threex: {
            exports: "THREE"
        },
        "threex-controls": {
            deps: [
                "threex"
            ]
        },
        bootstrap: {
            deps: [
                "jquery"
            ]
        },
        "jquery-migrate": {
            deps: [
                "jquery"
            ]
        },
        chosen: {
            deps: [
                "jquery",
                "jquery-migrate"
            ]
        },
        fileupload: {
            deps: [
                "jquery",
                "jquery-migrate"
            ]
        },
        loadTemplate: {
            deps: [
                "jquery",
                "handlebars"
            ]
        },
        OBJMTLLoader: {
            deps: [
                "MTLLoader",
                "threex"
            ]
        },
        MTLLoader: {
            deps: [
                "threex"
            ]
        },
        ColumnControls: {
            deps: [
                "threex"
            ]
        }
    },
    paths: {
        app: "../app",
        requirejs: "requirejs/require",
        css: "require-css/css",
        "threejs-stats": "threejs-stats/Stats",
        "css-builder": "require-css/css-builder",
        normalize: "require-css/normalize",
        jquery: "jquery/jquery",
        bootstrap: "bootstrap/dist/js/bootstrap",
        "socket.io-client": "socket.io-client/dist/socket.io",
        chosen: "metronic/js/chosen.jquery",
        "jquery-migrate": "jquery-migrate/jquery-migrate",
        fileupload: "metronic/js/bootstrap-fileupload",
        handlebars: "handlebars/handlebars",
        loadTemplate: "../app/LoadTemplate",
        "handlebars-bisheng": "handlebars-bisheng/dist/bisheng",
        "dat.gui": "dat.gui/dat.gui",
        "threex.domevents": "threex.domevents/threex.domevents",
        threex: "three/three60_src",
        "threex-controls": "threex-controls/controls/OrbitControls",
        "threex-defaultworld": "threex-defaultworld/defaultworld",
        "threejs-build": "threejs-build/build/three.min",
        "requirejs-text": "requirejs-text/text",
        moment: "moment/moment"
    },
    urlArgs: "bust=v2",
    waitSeconds:1000
});

