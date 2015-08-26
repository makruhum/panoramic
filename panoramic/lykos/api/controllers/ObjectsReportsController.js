/**
 * ObjectsReportsController
 *
 * @description :: Server-side logic for managing objectsreports
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    findOne:function(req,res){
        var id=req.param('id');
        ObjectsReports.findOne({id:id}).populateAll().exec(function findOneCB(err, found){
            var connection_id=found.objects_id.connection_id;
            Connection.findOne({id:connection_id}).exec(function findOneCB(err, data){
                eval(data.alias).query(found.objects_id.query,function(err,values){
                    ReportsParamsObjects.find({objects_reports_id:id}).populateAll().exec(function findOneCB(err, result){
                        var data=[]; var categories=[];
                        var keys= Object.keys(values.rows[0]);
                        function in_array(needle, haystack, argStrict) {
                            var key = '',
                                strict = !! argStrict;
                            if (strict) {
                                for (key in haystack) {
                                    if (haystack[key] === needle) {
                                        return true;
                                    }
                                }
                            } else {
                                for (key in haystack) {
                                    if (haystack[key] == needle) {
                                        return true;
                                    }
                                }
                            }

                            return false;
                        }
                        if(found.report_types_id.id==1 || found.report_types_id.id==2) {
                            /*Start Bar and Column Chart*/
                            for(var d=0; d < result.length; d++) {
                                if(result[d].reports_params_id.param_name=="data")
                                    var dataVar=result[d].column;
                                if(result[d].reports_params_id.param_name=="categories")
                                    var categoriesVar=result[d].column;
                                if(result[d].reports_params_id.param_name=="serie_name")
                                    var serieNameVar=result[d].column;
                            }
                            for(var c=0; c < keys.length; c++) {
                                if(keys[c]==dataVar)
                                    var dataIndex=c;
                                if(keys[c]==categoriesVar)
                                    var categoriesIndex=c;
                                if(keys[c]==serieNameVar)
                                    var serieNameIndex=c;
                            }
                            var seriesNamesArray=[]; var series=[];
                            for(var b=0; b < values.rows.length; b++) {
                                if(b==0) {
                                    seriesNamesArray.push(values.rows[b][keys[serieNameIndex]]);
                                    categories.push('"'+values.rows[b][keys[categoriesIndex]].replace(/"/g, '')+'"');
                                }
                                else {
                                    if(in_array(values.rows[b][keys[serieNameIndex]],seriesNamesArray)==false) {
                                        seriesNamesArray.push(values.rows[b][keys[serieNameIndex]]);
                                    }
                                    if(in_array('"'+values.rows[b][keys[categoriesIndex]]+'"',categories)==false) {
                                        categories.push('"'+values.rows[b][keys[categoriesIndex]].replace(/"/g, '')+'"');
                                    }
                                }
                            }
                            for(var e=0; e < seriesNamesArray.length; e++) {
                                for(var g=0; g < categories.length; g++) {
                                    var pushed=false;
                                    for(var f=0; f < values.rows.length; f++) {
                                        if(values.rows[f][keys[serieNameIndex]]==seriesNamesArray[e] && '"'+values.rows[f][keys[categoriesIndex]]+'"'==categories[g]) {
                                            data.push(parseInt(values.rows[f][keys[dataIndex]]));
                                            pushed=true;
                                        }
                                    }
                                    if(pushed==false) data.push(null);
                                }
                                series.push({name:String(seriesNamesArray[e]),data:data});
                                data=[];
                            }
                            if(found.report_types_id.id==1) var typeChart="bar"; if(found.report_types_id.id==2) var typeChart="column";
                            var reportContent='{"options":{"chart":{"type":"'+typeChart+'"}},"xAxis":{"categories":['+categories+']},"plotOptions":{"'+typeChart+'":{"dataLabels":{"enabled":true}}},"series":'+JSON.stringify(series)+',"title":{"text":"'+found.name+'"},"subtitle":{"text": "subtitle"},"loading": false, "legend":{"layout": "vertical","align": "right","verticalAlign": "top"}}';
                            /*End Bar*/
                        }
                        /*Start Pie Chart*/
                        if(found.report_types_id.id==3) {
                            for(var d=0; d < result.length; d++) {
                                if(result[d].reports_params_id.param_name=="element")
                                    var elementVar=result[d].column;
                                if(result[d].reports_params_id.param_name=="value")
                                    var valueVar=result[d].column;
                            }
                            for(var c=0; c < keys.length; c++) {
                                if(keys[c]==elementVar)
                                    var elementIndex=c;
                                if(keys[c]==valueVar)
                                    var valueIndex=c;
                            }
                            var pieData=[];
                            for(var b=0; b < values.rows.length; b++) {
                                pieData.push({name:values.rows[b][keys[elementIndex]],y:parseInt(values.rows[b][keys[valueIndex]])});
                            }
                            var reportContent='{"options":{"chart":{"type":"pie","plotBackgroundColor":"#00695c","options3d":{"enabled": true,"alpha": 45,"beta": 0}}},"plotOptions":{"pie":{"dataLabels":{"enabled":true},"showInLegend": true}},"series": [{"data":'+JSON.stringify(pieData)+'}]}';
                        }
                        /*End Pie Chart*/
                        return res.json(JSON.parse(reportContent));
                    });
                });
            });
        });
    },

    create:function(req,res){
        var columns = req.param('reportsparamsobjects');
        var paramsData = [];
        ObjectsReports.create({name:req.param('name'), objects_id:req.param('objects_id'), report_types_id:req.param('report_types_id'), description:req.param('description')}).exec(function createCB(err, createdReg){
            if (err) return res.serverError();

            for ( var i = 0; i < columns.length; i++) {
                paramsData.push ({'objects_reports_id':createdReg.id, 'reports_params_id':columns[i].reports_params_id, 'column':columns[i].column});
            };
            if (paramsData.length==columns.length){
                ReportsParamsObjects.create(paramsData).exec(function createCB(err, createdRegParams){
                    if(err) return res.json({"success":false, "message":"Ha ocurrido un problema"});
                    return res.json({"success":true, "message":"Reporte creado con éxito"});
                });
            }
        });
    }

};

