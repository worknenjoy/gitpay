/* eslint-disable */
const Role = require('../../models').Role
const Promise = require('bluebird')

roleCreate = async (roleParameters)=>{
try{
    let doc = await Role.findOne(
        {
            where:
            { 
                id:roleParameters.id,
                name:{ $or:['funder','contributor','maintainer'] }
            }
        }
    )
    if(!doc){
        let createRole = {
            name:roleParameters.name,
            label:roleParameters.label,            
        }
        let role = await Role.create(createRole);
        return role;
    }
    else{
        console.log('Role exists');
        return false;
    }
}
catch(err){
    console.log(err)
}
}
module.exports = Promise.method(roleCreate);
/* eslint-enable */