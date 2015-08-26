
module.exports = {

  tableName:'tbl_kpi',
  attributes: {
    id:{type:'integer', autoIncrement:true, primaryKey:true},
    name:{type:'string', required:true},
    description:{type:'string'},
    object_id:{type:'integer'},
    objKey: {type:'string'},
    objValue:{ type:'string'},
    name: {type:'string'},
    warnKey: {type:'string'},
    warnValue: {type:'string'},
    tolKey: {type:'string'},
    tolValue: {type:'string'},
    frecKey: {type:'string'},
    metric: {type:'string'},
    objects_id: {type:'integer'},
    users:{
        collection : 'user',
        via: 'kpis'
    }
  }
};

