/**
 * Created by Administrator on 2014/7/21.
 */

var http = require('http');
var express = require('express');
var config = require('./config');
var utils = require('./utils');

var app = express();
var log = require('./log');
log.use(app);

app.set('port',process.env.PORT || config.PORT);

var server = http.createServer(app);

app.core = {};
app.core.config = config;
app.core.utils = utils;

utils.registerPlugins(app);

exports.init = function(){
    console.log('tbus init...., please wait!');
    server.listen(app.get('port'),function(){
        console.log('tbus is listening on port ' + app.get('port'));
    });
}