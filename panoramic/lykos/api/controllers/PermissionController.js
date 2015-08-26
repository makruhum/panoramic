/* PermissionController
 *
 * @description :: Server-side logic for managing roleactions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    find: function(req, res, cb){

        var permission=[];


        var consulta="select r.id rol_id, r.name as role, p.id as permission_id, p.roles, "+
            "ma.id ma_id, ma.module_id ma_module_id, ma.action_id as ma_Action_id, "+
            "m.name as module, a.name as action "+
            "from tbl_roles r "+
            "left join tbl_permission p on r.id=p.roles "+
            "left join tbl_module_authorized ma on p.id= ma.permission "+
            "left join tbl_modules m on ma.module_id=m.id "+
            "left join tbl_actions a on ma.action_id=a.id "+
            "order by r.name, m.name, a.name asc";


        Permission.query(consulta,function(err,result){
            if (err || !result){
                console.log(err);
                return next({"error": "Un error ha ucurrido does not exist."});
            }

            for (var i = 0; i < result.rowCount; i++) {
                if (i===0) {
                    permission.push({role: {name: result.rows[i].role,
                                            id: result.rows[i].rol_id,
                                            module:[{name:result.rows[i].module,
                                                     actions:[{name:result.rows[i].action}]
                                                    }]
                                           },
                                     permission:{id:result.rows[i].permission_id}});

                }else{
                    if (permission[permission.length-1].role.name!=result.rows[i].role) {
                        permission.push({role: {name: result.rows[i].role,
                                                id: result.rows[i].rol_id,
                                                module:[{name:result.rows[i].module,
                                                         actions:[{name:result.rows[i].action}]
                                                        }]
                                               },
                                         permission:{id:result.rows[i].permission_id}});

                    }else{
                        if(permission[permission.length-1].role.module[permission[permission.length-1].role.module.length-1].name!=result.rows[i].module) {
                            permission[permission.length-1].role.module.push({name:result.rows[i].module,
                                                                              actions:[{name:result.rows[i].action}]});
                        } else{
                            permission[permission.length-1].role.module[permission[permission.length-1].role.module.length-1].actions.push({name:result.rows[i].action});
                        }

                    }

                }

            }


            return res.json(permission);

        });
    },

    create: function(req,res,cb){
        var param=req.body;
        console.log(param);
        //consulta si el rol seleccionado tiene una permisologia, de ser asi se debe usar es update
        Permission.findOne({roles: param.roles}).exec(function findCB(err,permission){
            if(err){
                console.log(err);
            }else{
                console.log(permission);
                if (!permission) {
                    Permission.create({roles:param.roles}).exec(function createCB(err,permission){
                        if (err) {
                            console.log("Ha ocurrido un error");
                        }else{
                            for (var i = 0; i < param.modulesAuthorized.length; i++ ){
                                param.modulesAuthorized[i].permission=permission.id;
                                ModuleAuthorized.create(param.modulesAuthorized[i]).exec(function createCB(err,moduleAuthorized){
                                    if (err) {
                                        console.log("erros creando modulo autorizado");
                                    }else{
                                        console.log(moduleAuthorized);
                                    }
                                });
                            }
                        }
                    });
                }else{
                    console.log("tiene datos, se debe hacer un update");
                }
            }
        });

        return res.json(req.param);
    },

    list: function(req, res, cb){
        var consulta="select r.id rol_id, r.name as rol, p.id as permission_id, p.roles, "+
            "ma.id ma_id, ma.module_id ma_module_id, ma.action_id as ma_Action_id, "+
            "m.name as modulo, a.name as action "+
            "from tbl_roles r "+
            "left join tbl_permission p on r.id=p.roles "+
            "left join tbl_module_authorized ma on p.id= ma.permission "+
            "left join tbl_modules m on ma.module_id=m.id "+
            "left join tbl_actions a on ma.action_id=a.id "+
            "order by r.name asc";

        Permission.query(consulta,function(err,result){
            if (err || !result){
                console.log(err);
                return next({"error": "Un error ha ucurrido does not exist."});
            }

            //console.log(result.rows);
            return res.json(result.rows);

        });


    },
    getList: function(req,res,cb){
        var lista=[];
        var search="select p.id permission_id,p.roles,r.id as role_id, r.name as name_rol, ma.id ma_id, ma.permission as permission, m.id as module_id, m.name as module_name, "+
            "m.description as description_module, a.name as action_name, a.id as action_id, a.description as description_action "+
            "from tbl_permission p "+
            "left join tbl_roles r on p.roles=r.id "+
            "left join tbl_module_authorized ma on p.id=ma.permission "+
            "left join tbl_modules m on m.id=ma.module_id "+
            "left join tbl_actions a on a.id=ma.action_id " +
            "where p.id= "+req.params.id +
            " order by m.name asc, a.name";
        Permission.query(search,function(err,result){
            if (err || !result){
                console.log(err);
                return next({"error": "Un error ha ocurrido"});
            }
            for (var i = 0; i < result.rowCount; i++) {
                if (i===0) {
                    lista.push({
                        modulesAuthorized: [{id: result.rows[i].ma_id,
                                             permission: result.rows[i].permission,
                                             module_id: result.rows[i].module_id,
                                             action_id: result.rows[i].action_id,
                                             module_name: result.rows[i].module_name,
                                             action_name: result.rows[i].action_name
                                            }],
                        roles: { id: result.rows[i].role_id,
                                name: result.rows[i].name_rol,
                                permission: result.rows[i].permission_id
                               },
                        id:result.rows[i].permission_id
                    }
                              );
                }else{

                    lista[0].modulesAuthorized.push({  id: result.rows[i].ma_id,
                                                     permission: result.rows[i].permission,
                                                     module_id: result.rows[i].module_id,
                                                     action_id: result.rows[i].action_id,
                                                     module_name: result.rows[i].module_name,
                                                     action_name: result.rows[i].action_name
                                                    });

                }

            }

            return res.json(lista);

        });
    },

    destroy: function(req,res,cb){
        console.log(req.params.id);
        ModuleAuthorized.destroy({permission:req.params.id}).exec(function deleteCB(err,modules){
            if(err){
                console.log(err);
                return cb(err);
            }
            console.log("modulos borrados " + modules);

            Permission.destroy({id: req.params.id}).exec(function deleteCB(err, permission){
                console.log("permission borrados " + permission);
                return res.json(200);
            });
        });
    },
    //metodo update debe optimizarce,actualmente solo borra los modulos autorizados y los agrega nuevamente
    update: function(req,res,cb){
        var permission_id=0;
        var data=[];
        if(req.body.length>0){
            permission_id=req.body[0].permission;
            data=req.body;

            //se borra primero los modulos autorizados de ese objeto permission
            //para posteriormente actualizar con los nuevos
            ModuleAuthorized.destroy({permission:permission_id}).exec(function deleteCB(err,modules){
                if(err){
                    console.log("Error Ocurrido durante actualización de permisos (borrado de modulos autorizados)");
                    return res.cb(err);
                }else{
                    for (var i = 0; i < data.length; i++ ){
                        ModuleAuthorized.create(data[i]).exec(function createCB(err,moduleAuthorized){
                            if (err) {
                                console.log("error creando modulo autorizado");
                                return res.cb(err);
                            }else{
                                console.log(moduleAuthorized);
                            }
                        });
                    }
                }
            });
        }
        return res.json(req.body);
    }



};

