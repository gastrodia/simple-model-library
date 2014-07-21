/**
 * Created by gastrodia on 14-4-30.
 */


var Waterline = require("waterline");


module.exports = Waterline.Collection.extend({
    tableName:'ob',
    adapter:'mysql',
    attributes:{
        source_path:{
            type:'string',
            maxLength:255,
            required:false
        },
        source_type:{
            type:'string',
            maxLength:10,
            required:false
        },
        name:{
            type:'string',
            maxLength:255,
            required:true
        },
        path:{
            type:'string',
            maxLength:255,
            required:true
        },
        type:{
            type:'string',
            maxLength:20,
            required:true
        },
        thumb_path:{
          type:'string',
          maxLength:255,
          required:true
        },
        type_id:{
            type:'integer',
            required:false
        }
    }
})