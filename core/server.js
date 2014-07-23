/**
 * Created by Administrator on 2014/7/21.
 */

var http = require('http');
var path = require('path');
var express = require('express');
var hbs = require('hbs');
var config = require('./config');
var utils = require('./utils');
var flash = require('connect-flash');
var store = require('connect-mysql')(express);
var log = require('./log');
var plugin = require('./plugin');

var app = express();
log.use(app);

app.set('port',process.env.PORT || config.PORT);

var server = http.createServer(app);

app.core = {};
app.core.config = config;
app.core.utils = utils;
app.core.utils.registerPlugin = plugin.registerPlugin;

//cookie session flash
var cookieParser = express.cookieParser(config.sessionKey);
var sessionStore = new store({
    config: config.mysqlConfig
});
app.use(cookieParser);
app.use(express.bodyParser({
    uploadDir:path.join(config.LPR , "tmp")
}));
app.use(express.session({
    store: sessionStore
}));
app.use(flash());

//挂载www目录
app.set('views',path.join(config.LPR, 'plugins/'));
//hbs.registerHelper('helper_name', function(...) { ... });
hbs.registerPartials(path.join(config.LPR, 'plugins/_partials'));
//app.set('view engine', 'html');
app.engine('html', hbs.__express);
//静态文件
app.use(express.static(path.join(config.LPR , 'public')));


plugin.init(app);


exports.init = function(){
    console.log('tbus init...., please wait!');
    server.listen(app.get('port'),function(){
        console.log('tbus is listening on port ' + app.get('port'));
    });
}