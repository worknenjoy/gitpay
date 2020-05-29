/*eslint-disable */ 
const Role = require('../../models').Role
const Promise = require('bluebird')

roleDelete = async(roleParameters)=>{
try{
    let role = await Role.destroy(
        {
            where:
            {
                userId:roleParameters.userId
            }
        }
    )
    if(!role){
        console.log('role not found');
        return false
    }
    else
    return true;
}
catch(err){
    console.log(err);
}
}
module.exports = Promise.method(roleDelete);