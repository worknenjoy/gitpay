/*eslint-disable*/ 
const Role = require('../../roles')

exports.fetchRoleById = async(req, res)=>{
try{
    let doc = await Role.roleFetchById(req.params)
    if(doc!==[]){
    console.log('found role',doc)
    return res.status(200).send(doc)
    }
}
catch(err){
    console.log(err)
    return res.status(500).send(false)
}
}

exports.fetchRole = async(req, res)=>{
    try{
        let doc = await Role.roleFetch()
        if(doc!==[]){
        console.log('found role',doc)
        return res.status(200).send(doc)
        }
    }
    catch(err){
        console.log(err)
        return res.status(500).send(false)
    }
    }

exports.createRole = async(req, res) =>{
    try{
        req.body.userId = req.user.id
        let doc = await Role.roleCreate(req.body)
        if(doc!==[]){
        console.log('role created',doc)
        return res.status(201).send(doc)
        }
    }catch(err){
        console.log(err)
        return res.status(500).send(false)
    }
}

exports.deleteRoleById = async(req,res)=>{
    try{
        let doc = await Role.roleDelete(req.params)
        if(doc!==[]){
        console.log('role deleted')
        return res.status(200).send({'msg':'ok'})
    }
    }catch(err){
        console.log(err)
        return res.status(500).send(false)
    }
}