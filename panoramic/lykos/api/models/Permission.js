/**
* RoleAction.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

//modelo que sirve de intermediario para poder relacionar roles y acciones
//y poder agregar nuevas columnas, ya que una simple relacion many to many
//no sirve para este fin
module.exports = {

	tableName: 'tbl_permission',
  attributes: {
  	id: 	{type:'integer', autoIncrement:true, primaryKey:true},
  	roles: 	{
      model:'role'
    },
    modulesAuthorized:{
      collection: 'moduleAuthorized',
      via: 'permission'
    }
  }
};

