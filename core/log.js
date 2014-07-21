/**
 * Created by Administrator on 2014/6/24.
 */


var log4js = require('log4js');
var utils = require('./utils');

//确定日志目录存在，不存在先创建
utils.mkdirSync('../logs');

log4js.configure({
    appenders: [
        {
            type: 'console'
        }, //控制台输出
        {
            type: "dateFile",
            filename: 'logs/log.log',
            pattern: "_yyyy-MM-dd",
            alwaysIncludePattern: false,
            category: 'normal'
        }//日期文件格式
    ],
    replaceConsole: true,   //替换console.log
    levels:{
        normal: 'INFO'
    }
});

var logger = log4js.getLogger('normal');



exports.logger = logger;

exports.use = function(app) {
    app.use(log4js.connectLogger(logger, {level:'auto', format:':method :url'}));
}