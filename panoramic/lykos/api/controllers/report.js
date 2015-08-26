module.exports = function(query) {

		return {
		getColumns:function(){
			var path = require('path');
			eval(path.basename(__filename,'.js').substring(0,9)).query(query,function(err,values){
				var columns=[];
				for(var a=0; a < values.fields.length; a++) {
					columns.push(values.fields[a].name);
				}
				return columns;
			});
		},

		buildReport:function(){
			var path = require('path');
			eval(path.basename(__filename,'.js').substring(0,9)).query(query,function(err,values){
				//if(err) return res.serverError(err);

				var columns=[];
				var title="Hola";
				for(var a=0; a < values.fields.length; a++){
					columns.push(values.fields[a].name);
				}

				ReportsParamsObjects.find({objects_reports_id:'30'}).populateAll().exec(function findOneCB(err, result){
					var data=[]; var categories=[];
					var keys= Object.keys(values.rows[0]);					
					for(var d=0; d < result.length; d++) {
						if(result[d].reports_params_id.param_name=="data")
							var dataVar=result[d].column;
						if(result[d].reports_params_id.param_name=="categories")
							var categoriesVar=result[d].column;
					}
					for(var c=0; c < keys.length; c++) {
						if(keys[c]==dataVar)
							var dataIndex=c;
						if(keys[c]==categoriesVar)
							var categoriesIndex=c;
					}
					for(var b=0; b < values.rows.length; b++) {
						data.push(values.rows[b][keys[dataIndex]]);
						categories.push('"'+values.rows[b][keys[categoriesIndex]]+'"');
					}
					var reportContent='{"options":{"chart":{"type":"bar"}},"xAxis":{"categories":['+categories+']},"plotOptions":{"bar":{"dataLabels":{"enabled":true}}},"series":[{"data":['+data+']}],"title":{"text": "'+title+'"},"loading": false}';

					return JSON.parse(reportContent);
				});					
			});
		}
	}
}