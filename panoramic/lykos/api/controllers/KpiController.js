/**
 * KpiController
 *  
 * @module      :: Controller
 * @description	:: Provides the base authentication
 *                 actions used to make waterlock work.
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

module.exports ={

    getAllKpiWithValue :function  (req, res) {

        var id=req.param('id');
        var limit=req.param('limit');
        var data = req.param('data');

        console.log (req.param('data'));
        if(id==='null') {

            return res.json({err:'error id'});
        }

        Objects.findOne({id:id}).populateAll().exec(function findOneCB(err, found){
            var connection_id=found.connection_id.id;
            Connection.findOne({id:connection_id}).exec(function findOneCB(err, result){									
                eval(result.alias).query("SELECT * FROM ("+found.query+") alias ",function(err,values){
                    if(err)return res.json(err);

                    return res.json({value:values.rows[0].value,data:data});
                });

            });
        });	

    },
    getKpiWithTable: function  (req, res) {

        console.log("getKpiWithTable");
    },

    getAllKpi:function(req,res){

        var roleId=req.session.user.role_id;

        Role.find({id:roleId}).exec(function(e,r){
            if(e){
                console.log("Un error ha ocurrido, no consiguio el rol");
                return res.json(e);
            }else{
                if(r[0].name=='Administrador'){
                    Kpi.find({}).exec(function findCB(err, result){
                        if (err) {
                            console.log (err);
                        } else {
                            for(var a=0; a < result.length; a++) {
                                result[a].resultValue = eval(result[a].metric);
                                console.log(result[a].resultValue+" "+result[a].warnKey +" "+result[a].warnValue);
                                if(result[a].resultValue==undefined || result[a].warnValue==undefined || result[a].warnKey== undefined)  {
                                    result[a].isWarn = true;
                                }else {
                                    result[a].isWarn = eval(result[a].resultValue+" "+result[a].warnKey +" "+result[a].warnValue);
                                }
                            };
                            return res.json({data:result});
                        }
                    });
                }else{
                    User.find({id:req.session.user.id}).populate('kpis').exec(function(err, result){
                        if(e){
                            console.log("en el user find");
                            console.log(e);
                            return res.json(e);
                        }else{
                            for(var a=0; a < result[0].kpis.length; a++) {
                                result[0].kpis[a].resultValue = eval(result[0].kpis[a].metric);
                                console.log(result[0].kpis[a].resultValue+" "+result[0].kpis[a].warnKey +" "+result[0].kpis[a].warnValue);
                                if(result[0].kpis[a].resultValue==undefined || result[0].kpis[a].warnValue==undefined || result[0].kpis[a].warnKey== undefined)  {
                                    result[0].kpis[a].isWarn = true;
                                }else {
                                    result[0].kpis[a].isWarn = true;
                                }
                            };
                            delete(result[0].auth);
                            delete(result[0].role_id);
                            delete(result[0].firstName);
                            delete(result[0].secondName);
                            delete(result[0].surname);
                            delete(result[0].secondSurname);
                            delete(result[0].createdAt);
                            delete(result[0].updatedAt);
                            return res.json({data:result[0].kpis});
                        }
                    });
                }

            }
        }
                                   );
    },

    find: function(req,res){

        var roleId=req.session.user.role_id;

        Role.find({id:roleId}).exec(function(e,r){
            if(e){
                console.log("Un error ha ocurrido, no consiguio el rol");
                return res.json(e);
            }else{
                if(r[0].name=='Administrador'){
                    Kpi.find().exec(function(e,r){
                        if(e){
                            console.log("un Error ha ocurrido, no consiguio los objetos del usuario")
                        }else{
                            return res.json(r);
                        }
                    });
                }else{
                    User.find({id:req.session.user.id}).populate('kpis').exec(function(e,r){
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
                            return res.json(r[0].kpis);
                        }
                    });
                }

            }
        }
                                   );
    }

};


