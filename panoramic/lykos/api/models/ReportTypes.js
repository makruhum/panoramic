/**
* ReportTypes.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName:'tbl_report_types',
  attributes: {
  	id:{type:'integer', autoIncrement:true, primaryKey:true},
  	name:{type:'string', required:true},
  	report_engines_id:{type:'integer', required:true, model:'ReportEngines'},
  	format:{type:'json', required:true},
  	params: {
  		collection:'ReportsParams',
      via:'report_types_id'
  	}
  },
  	beforeCreate: function(values, next) {
    // validacion de las restricciones (foreignKey)
    ReportEngines.findOne(values.report_engines_id, function(err, value){
      if (err || !value){
        return next({"error": "report engines id does not exist."});
      }
      return next();
    });
  }
};

