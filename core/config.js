/**
 * Created by Administrator on 2014/7/21.
 */

var path = require('path');

exports.PORT = 3221;

//local project root
exports.LPR = path.join(__dirname,"..");

var mysqlAdapter = require('sails-mysql');
mysqlAdapter.config = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'simple_model_library',
    charset  : 'utf8'
};

exports.ormConfig = {
    adapters:{
        mysql: mysqlAdapter
    },
    defaults:{
        migrate:'alert'
    }
}
