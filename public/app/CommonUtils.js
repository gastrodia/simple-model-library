/**
 * Created by Administrator on 2014/6/5.
 */

define([],function(){
    return {
        receiveQuery:function(){
            var queryJson = {};
            var searchStr = location.search;
            queryStr = null;
            if(searchStr){
                queryStr = location.search.split("?")[1];
            }

            if(queryStr){
                queryStrArr = queryStr.split("&");
                for(i in queryStrArr){
                    var query = queryStrArr[i];
                    var sq = query.split("=");
                    queryJson[sq[0]] = sq[1];
                }
            }

            return queryJson;
        },
        loadTemplate:function(){

        }
    }
})