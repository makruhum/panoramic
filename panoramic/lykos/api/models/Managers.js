/**
* Managers.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName:'tbl_managers',
  attributes: {
  	id:{type:'integer', autoIncrement:true, primaryKey:true},
  	name:{type:'string', required:true},
  	description:{type:'string'},
    adapter:{type:'string',required:true},
  	connections:{
  		collection:'Connection',
  		via:'managers_id'
  	}
  }
};