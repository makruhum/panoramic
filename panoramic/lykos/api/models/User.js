/**
 * User
 *
 * @module      :: Model
 * @description :: This is the base user model
 * @docs        :: http://waterlock.ninja/documentation
 */

module.exports = {

    attributes: require('waterlock').models.user.attributes({

        firstName:{type:'string', required:true},
        secondName:{type:'string'},
        surname:{type:'string', required: true},
        secondSurname:{type:'string'},
        role_id:{
            model: 'role'
        },
        objects:{
            collection : 'objects',
            via : 'users'
        },
        kpis:{
            collection : 'kpi',
            via : 'users'
        }

    }),

    beforeCreate: require('waterlock').models.user.beforeCreate,
    beforeUpdate: require('waterlock').models.user.beforeUpdate
};
