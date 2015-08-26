/**
* Modules.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName:'tbl_modules',
  attributes: {
  	id:{type:'integer', autoIncrement:true, primaryKey:true},
  	name:{type:'string', required:true},
  	description:{type:'string'},
    actions: {
      collection: 'actions',
      via: 'modules'
    },
    moduleAuthorized: {
      collection: 'moduleAuthorized',
      via: 'module_id'
    },
    /*,
    permissions:{
      collection: 'permission',
      via: 'modules'
    }*/

  }
};

