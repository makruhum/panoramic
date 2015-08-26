/**
* ReportEngines.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName:'tbl_report_engines',
  attributes: {
  	id:{type:'integer', autoIncrement:true, primaryKey:true},
  	name:{type:'string', required:true},
  	url:{type:'string'}
  }
};

