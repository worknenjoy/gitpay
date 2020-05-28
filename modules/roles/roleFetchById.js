/*eslint-disable */ 
const Role = require('../../models').Role
const Promise = require('bluebird')

roleFetchById = async(roleParameters)=>{
try{
    // console.log(roleParameters)
    let role = await Role.findAll(
        {
            where:
            {
                id:roleParameters.id
            }
        }
    )
    if(!role){
        console.log('role not found')
        return false
    }
    else
    return role;
}
catch(err){
console.log(err);
return false
}
}
module.exports = Promise.method(roleFetchById);
