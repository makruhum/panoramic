module.exports = {

    getKPIMetric:function(req,res){
        var math = require('mathjs');
        var metric=req.param('metric');
        var replacedField=[];
        //console.log(metric);
        var blocksArray=[];
        var positionsArray=[];
        var conditionsArray=[];
        for(var b=0; b < metric.length; b++) {
            if(metric.charAt(b)=="[") {
                positionsArray.push({"position":b+1});
            }
            if(metric.charAt(b)=="]") {
                positionsArray.push({"position":b});
            }
        }
        for(var c=0; c < positionsArray.length/2; c++) {
            if(c==0) {
                console.log(metric.slice(positionsArray[c].position, positionsArray[c+1].position));
                conditionsArray.push(metric.slice(positionsArray[c].position, positionsArray[c+1].position));
            }
            else {
                console.log(metric.slice(positionsArray[c+1].position, positionsArray[c+2].position));
                conditionsArray.push(metric.slice(positionsArray[c+1].position, positionsArray[c+2].position));
            }
        }
        for(var i=0; i < req.param('fields').length; i++) {
            for(var a=0; a < req.param('data').length; a++) {
                replacedField.push(parseFloat(req.param('data')[a][req.param('fields')[i]]));
                if(a == req.param('data').length-1) {
                    metric=metric.replace("sum("+req.param('fields')[i]+")", "sum("+replacedField+")");
                    //console.log(metric.search("\\[WHERE\\["));
                    replacedField=[];
                }
            }
        }
        var metricNumber=eval(metric);
        return res.json({"metric":metricNumber});
        //	return res.ok();
    },


    saveConfig:function(req,res){
        console.log ("Guardando");
        var data = req.param('data');
        console.log (req.param('data'));

        Kpi.create(  {objects_id:data.objects_id, objKey:data.objKey,  objValue: data.objValue,  name: data.name,  warnKey: data.warnKey,  warnValue: data.warnValue,  tolKey: data.tolKey,  tolValue: data.tolValue,  frecKey: data.frecKey,metric:data.dataMetric.metric, users:data.users}).exec(function createCB(err, created){
            if (err) {
                console.log (err);
            } else {
                return res.ok();
            }
        });
    },

    getColumns:function(req,res){
        var id=req.param('id');
        var limit=req.param('limit');
        Objects.findOne({id:id}).populateAll().exec(function findOneCB(err, found){
            var connection_id=found.connection_id.id;
            Connection.findOne({id:connection_id}).exec(function findOneCB(err, data){
                if(req.param('columns') && req.param('rows')) {
                    eval(data.alias).query(found.query,function(err,values){
                        var tableColumns=req.param('columns');
                        var tableRows=req.param('rows');
                        var queryColumns=[]; var queryRows=[]; var groupable=[];
                        for(var c=0; c < tableRows.length; c++) {
                            if(isNaN(values.rows[0][tableRows[c]])==false){
                                queryRows.push("sum(alias."+tableRows[c]+") as "+tableRows[c]);
                            }
                            else {
                                queryRows.push("alias."+tableRows[c]);
                                groupable.push("alias."+tableRows[c]);
                            }
                        }
                        for(var b=0; b < tableColumns.length; b++) {
                            if(isNaN(values.rows[0][tableColumns[b]])==false){
                                queryColumns.push("sum(alias."+tableColumns[b]+") as "+tableColumns[b]);
                            }
                            else {
                                queryColumns.push("alias."+tableColumns[b]);
                                groupable.push("alias."+tableColumns[b]);
                            }
                        }
                        console.log("SELECT "+queryRows.toString()+","+queryColumns.toString()+" FROM ("+found.query+") alias GROUP BY "+groupable.toString());
                        eval(data.alias).query("SELECT "+queryRows.toString()+","+queryColumns.toString()+" FROM ("+found.query+") alias GROUP BY "+groupable.toString(),function(err,dataPivot){
                            return res.json({data:dataPivot.rows});
                        });
                    });
                }
                else {
                    if(limit=="*")
                        var limitClause="";
                    else
                        var limitClause="LIMIT "+limit;
                    eval(data.alias).query("SELECT * FROM ("+found.query+") alias "+limitClause,function(err,values){
                        if(err)return res.json(err);
                        if(values.fields==undefined) {
                            values.fields=[];
                        }
                        var columns=[];

                        for(var a=0; a < values.fields.length; a++) {
                            if(isNaN(values.rows[0][values.fields[a].name])==false)
                                columns.push({title:values.fields[a].name});
                        }
                        return res.json({fields:columns,data:values.rows});
                    });
                }
            });
        });
    },

    loadFile:function(req,res){
        XLSX = require('xlsx');
        var workbook = XLSX.readFile('dolartoday.xlsx');
        var first_sheet_name = workbook.SheetNames[0];
        return res.json({data:XLSX.utils.sheet_to_json(workbook.Sheets[first_sheet_name])});
    },

    find: function(req,res){

        var roleId=req.session.user.role_id;

        Role.find({id:roleId}).exec(function(e,r){
            if(e){
                console.log("un error ha ocurrido, no consigio el rol");
                return res.json(e);
            }else{

                console.log("antes de comprar administrador");
                console.log(r[0].name);
                if(r[0].name=='Administrador'){

                    console.log("entro al if");
                    Objects.find().exec(function(e,r){
                        if(e){
                            console.log("un Error ha ocurrido, no consiguio los objetos del usuario")
                        }else{
                            return res.json(r);
                        }
                    });
                }else{

                    //req.session.user.id
                    User.find({id:req.session.user.id}).populate('objects').exec(function(e,r){
                        //console.log(r);
                        if(e){
                            console.log(e);
                            return res.json(e);
                        }else{
                            delete(r[0].auth);
                            delete(r[0].role_id);
                            delete(r[0].firstName);
                            delete(r[0].secondName);
                            delete(r[0].surname);
                            delete(r[0].secondSurname);
                            delete(r[0].createdAt);
                            delete(r[0].updatedAt);
                            return res.json(r[0].objects);
                        }
                    });
                }

            }
        }
                                   );
    }

}
