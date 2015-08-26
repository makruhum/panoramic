/**
* ModuleAuthorized.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName: 'tbl_module_authorized',
  attributes: {
  	id: 	{type:'integer', autoIncrement:true, primaryKey:true},
  	permission:{
     model: 'permission'
    },
    module_id:{
    	model: 'modules'
    },
    action_id:{
    	model: 'actions'
    }
  }
};

