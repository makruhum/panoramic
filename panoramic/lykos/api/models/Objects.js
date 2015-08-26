/**
* Objects.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    tableName:'tbl_objects',
    attributes: {
        id:{type:'integer', autoIncrement:true, primaryKey:true},
        name:{type:'string', required:true},
        description:{type:'string'},
        query:{type:'string'},
        connection_id:{type:'integer', model:'Connection'},
        objects_reports:{
            collection:'ObjectsReports',
            via:'objects_id'
        },
        users:{
            collection : 'user',
            via: 'objects'
        }


    },
    beforeCreate: function(values, next) {
        // validacion de las restricciones (foreignKey)
        Connection.findOne(values.connection_id, function(err, value){
            if (err || !value){
                return next({"error": "connection id does not exist."});
            }
            return next();
        });
    }
};

