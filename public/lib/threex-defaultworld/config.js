require.config({
  shim: {
    threex: {
      exports: "THREE"
    },
    "threex-controls": {
      deps: [
        "three"
      ]
    }
  },
  paths: {
    threex: "bower_components/three.js/three.min",
    requirejs: "bower_components/requirejs/require",
    "threex-controls": "bower_components/threex-controls/controls/OrbitControls",
    "threejs-stats": "bower_components/threejs-stats/Stats"
  }
});
