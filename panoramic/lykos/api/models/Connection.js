/**
* Connection.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName:'tbl_connection',
  attributes: {

  	id:{type:'integer', autoIncrement:true, primaryKey:true},
  	host:{type:'string', required:true},
  	user:{type:'string', required:true},
  	password:{type:'string', required:true},
  	alias:{type:'string',required:true},
    is_system:{type:'boolean', defaultsTo:false},
  	port:{type:'integer', required:true},
    database:{type:'string',required:true},
  	managers_id:{type:'integer', required:true, model:'Managers'},
  	objects:{
  		collection:'Objects',
  		via:'connection_id'
  	}
  },
   beforeCreate: function(values, next) {
    // Verify that the brand id is valid
    Managers.findOne(values.managers_id, function(err, manager){
      if (err || !manager){
        return next({"error": "managers_id does not exist."});
      }
      return next();
    });
  }
}