/**
* ObjectsReports.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName:'tbl_objects_reports',
  attributes: {
  	id:{type:'integer', autoIncrement:true, primaryKey:true},
  	objects_id:{type:'integer', required:true, model:'Objects'},
  	report_types_id:{type:'integer', required:true, model:'ReportTypes'},
  	name:{type:'string', required:true},
  	description:{type:'string'},
  	is_public:{type:'boolean', defaultsTo:true},
  	params: {
  		collection:'ReportsParamsObjects',
      via:'objects_reports_id'
  	}
  },
  	beforeCreate: function(values, next) {
    // validacion de las restricciones (foreignKey)
    ReportTypes.findOne(values.report_types_id, function(err, value){
      if (err || !value){
        return next({"error": "report types id does not exist."});
      }
      //return next();
    });
    Objects.findOne(values.objects_id, function(err, value){
      if (err || !value){
        return next({"error": "objects id does not exist."});
      }
      return next();
    });
  }
};

