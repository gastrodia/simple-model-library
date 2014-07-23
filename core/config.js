/**
 * Created by Administrator on 2014/7/21.
 */

var path = require('path');

exports.PORT = 3221;

//local project root
exports.LPR = path.join(__dirname,"..");

exports.sessionKey = "simple-model-library";

var mysqlConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'simple_model_library',
    charset  : 'utf8'
};
var mysqlAdapter = require('sails-mysql');
mysqlAdapter.config = mysqlConfig;

exports.mysqlConfig = mysqlConfig;

exports.ormConfig = {
    adapters:{
        mysql: mysqlAdapter
    },
    defaults:{
        migrate:'alert'
    }
}

exports.uploadPath = path.join(__dirname,"../public/uploads");