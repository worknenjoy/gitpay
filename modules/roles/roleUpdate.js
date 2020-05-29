/*eslint-disable */ 
const Role = require('../../models').Role
const Promise = require('bluebird')

roleUpdate = async(roleParameters)=>{
try{
    console.log(roleParameters)
    let role = await Role.findOne({where:{userId:roleParameters.userId}})
    let doc = await Role.update(
        {
            name:role.name+','+roleParameters.name
        },
        {
            where:
            {
                userId:roleParameters.userId
            }
        }
    )
    if(!doc){
        console.log('role not found')
        return false
        }        
    else{
    return doc;
}
}
catch(err){
console.log(err);
}
}
module.exports = Promise.method(roleUpdate);
