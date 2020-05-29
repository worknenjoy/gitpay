/*eslint-disable*/ 
const Role = require('../../roles')

// redundant func
exports.fetchRoleById = async(req, res)=>{
try{
    let doc = await Role.roleFetchById(req.params)
    if(doc){
    console.log('found role',doc)
    return res.status(200).send(doc)
    }
}
catch(err){
    console.log(err)
    return res.status(500).send(false)
}
}
/*
 * GET @ /roles/fetch
 *
 */
exports.fetchRole = async(req, res)=>{
    try{
        req.body.userId = req.user.id
        let doc = await Role.roleFetch(req.body)
        if(doc){
        console.log('found role',doc)
        return res.status(200).send(doc)
        }
    }
    catch(err){
        console.log(err)
        return res.status(500).send(false)
    }
    }
/*
 * POST @ /roles/create
 *
 */
exports.createRole = async(req, res) =>{
    try{
        req.body.userId = req.user.id
        let doc = await Role.roleCreate(req.body)
        if(doc){
        console.log('role created',doc)
        return res.status(201).send(doc)
        }
    }catch(err){
        console.log(err)
        return res.status(500).send(false)
    }
}
/*
 * PUT @ /roles/update
 *
 */
exports.updateRole = async(req, res) =>{
    try{
        req.body.userId = req.user.id
        let doc = await Role.roleUpdate(req.body)
        if(doc){
        console.log('role updated',doc)
        return res.status(201).send(doc)
        }
    }catch(err){
        console.log(err)
        return res.status(500).send(false)
    }
}

/*
 * DELETE @ /roles/delete
 *
 */
exports.deleteRole = async(req,res)=>{
    try{
        req.body.userId = req.user.id
        let doc = await Role.roleDelete(req.body)
        if(doc){
        console.log('role deleted')
        return res.status(200).send({'msg':'ok'})
    }
    }catch(err){
        console.log(err)
        return res.status(500).send(false)
    }
}