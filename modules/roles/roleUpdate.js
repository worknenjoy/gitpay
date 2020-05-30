/*eslint-disable */ 
const Role = require('../../models').Role
const Promise = require('bluebird')

roleUpdate = async(roleParameters)=>{
try{
    console.log(roleParameters)
    // let role = await Role.findOne({where:{userId:roleParameters.userId}})
    // console.log(role)
    let doc = await Role.update(
        {
            name:roleParameters.name
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
    // return doc;  returns [1]
    return await Role.findOne({where:{userId:roleParameters.userId}})
    // return tthe update doc because the roleAction function requires json {name:'<something_here>'} and not [1]
}
}
catch(err){
console.log(err);
}
}
module.exports = Promise.method(roleUpdate);
