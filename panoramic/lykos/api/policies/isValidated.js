/**
 * isValidated
 *
 * @module      :: Policy
 * @description :: Politica que consulta permisos del usuario logueado
 *                 de tener permisos da acceso a las aciones de los controladores
 *                 en caso contrario respond econ forbidden
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 *
 */
module.exports = function(req, res, next) {

    var action=req.options.action;
    var controller=req.options.controller;
    var email=req.session.user.auth.email;
    var consulta= "select u.role_id as role_id,a.email as email, r.name as role_name, " +
        " ma.module_id as module_id,ma.action_id as action_id, ma.id as module_authorized_id, " +
        " p.id as permission_id, m.name as module_name, ac.name as action_name " +
        " from \"user\" as u "+
        " left join auth as a on u.auth=a.id "+
        " left join tbl_roles as r on u.role_id=r.id "+
        " left join tbl_permission as p on r.id=p.roles "+
        " left join tbl_module_authorized as ma on p.id=ma.permission "+
        " left join tbl_modules as m on ma.module_id=m.id "+
        " left join tbl_actions as ac on ma.action_id=ac.id "+
        " where a.email='"+email+"'"+
        " order by a.email, m.name, ac.name; ";
    //var permission=[];

    Permission.query(consulta,function(err,result){
        if (err || !result){
            console.log(err);
            return next({"error": "Un error ha ocurrido no existen registros."});
        }else{

            for (var i = 0; i < result.rowCount; i++) {
                if(result.rows[i].module_name==controller){
                    if(result.rows[i].action_name==action){
                        console.info("Tiene acceso al controlador " + controller + " y la accion " + action);
                        return next();
                    }
                }
            }
            console.warn("No tiene acceso al controlador " + controller + " y la accion " + action);
            return res.forbidden('Usted no tiene acceso a la acion ejecutada');
        }
        return res.json(result.rows);

    });

};
