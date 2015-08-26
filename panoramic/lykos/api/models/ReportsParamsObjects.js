/**
* ReportsParamsObjects.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName:'tbl_reports_params_objects',
  attributes: {
  	id:{type:'integer', autoIncrement:true, primaryKey:true},
  	objects_reports_id:{type:'integer', required:true},
  	reports_params_id:{type:'integer', required:true, model:'ReportsParams'},
  	column:{type:'string', required:true},
  	condition:{type:'string'}
  },
  	beforeCreate: function(values, next) {
    // validacion de las restricciones (foreignKey)
   /* ObjectsReports.findOne(values.objects_reports_id, function(err, value){
      if (err || !value){
        return next({"error": "objects reports id does not exist."});
      }
      return next();
    }); */
    ReportsParams.findOne(values.reports_params_id, function(err, value){
      if (err || !value){
        return next({"error": "reports params id does not exist."});
      }
      return next();
    });
  }
};

