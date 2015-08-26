/**
* ReportsParams.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName:'tbl_reports_params',
  attributes: {
  	id:{type:'integer', autoIncrement:true, primaryKey:true},
  	report_types_id:{type:'integer', required:true, model:'ReportTypes'},
  	param_name:{type:'string', required:true},
  	format:{type:'string'},
  	type:{type:'integer', required:true}
  },
  	beforeCreate: function(values, next) {
    // validacion de las restricciones (foreignKey)
    ReportTypes.findOne(values.report_types_id, function(err, value){
      if (err || !value){
        return next({"error": "report types id does not exist."});
      }
      return next();
    });
  }
};

