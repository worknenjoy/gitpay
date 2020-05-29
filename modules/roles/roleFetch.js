/*eslint-disable */ 
const Role = require('../../models').Role
const Promise = require('bluebird')

roleFetch = async(roleParameters)=>{
try{
    // console.log(roleParameters)
    let role = await Role.findOne(
        {
            where:
            {
                userId:roleParameters.userId
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
}
}
module.exports = Promise.method(roleFetch);
