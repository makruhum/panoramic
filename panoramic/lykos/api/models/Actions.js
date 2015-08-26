/**
* Actions.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

 tableName: 'tbl_actions',
  attributes: {
  	id:{type:'integer', autoIncrement:true, primaryKey:true},
  	name:{type:'string', required:true},
    controller:{type:'string', required:true},
  	description:{type:'string'},
    modules:{
      collection: 'modules',
      via: 'actions'  	
    },
    actionAuthorized: {
      collection: 'moduleAuthorized',
      via: 'action_id'
    }
  }
};
