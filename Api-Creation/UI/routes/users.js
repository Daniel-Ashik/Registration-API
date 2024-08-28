var express=require('express')
var router=express.Router()
let serviceCall=require('./apicall')
router.post('/create',async function(req,res){
    try{
        let reqRes=await serviceCall.callPostMethod(`/create`,req.body)
        res.send(reqRes)
        // console.log(reqRes.body)
    }catch(err){
        res.send(err)
        // console.log(err)
    }
    // console.log(reqRes)
})
router.post('/login',async function(req,res){
    try{
        let reqRes=await serviceCall.callPostMethod(`/login`,req.body)
        res.send(reqRes.body)
        // console.log(reqRes.body)
    }catch(err){
        res.send(err)
    }
})

router.get('/getusers',async function(req,res){
    let header=req.headers['authorized']
    try{
        let reqRes=await serviceCall.callGetMethod(`/getusers`,header)
        res.send(reqRes.body)
    }catch(err){
        res.send(err)
    }
})

router.get('/view',async function(req,res){
    try{
        let reqRes=await serviceCall.callGetMethod(`/view?id=${req.query.id}`)
        // console.log(reqRes.body)
        res.send(reqRes.body)
    }catch(err){
        res.send(err)
    }
})
router.post('/welcome',async function(req,res){
    let header=req.headers['authorized']
    try{
        let reqRes=await serviceCall.callGetMethod(`/welcome?id=${req.query.id}`,header)
        console.log(reqRes)
        res.send(reqRes.body)
        // console.log(reqRes.body)
    }catch(err){
        res.send(err)
    }

})
router.post('/delete',async function(req,res){
    let header=req.headers['authorized']
    // console.log(header)
    try{
        let reqRes=await serviceCall.callPostMethod(`/delete?id=${req.query.id}`,null,header)
        // console.log(reqRes)
        res.send(reqRes.body)
    }catch(err){
        res.send(err)
    }
})


router.post('/update',async function(req,res){
    let id=req.query.id
    let header=req.headers['authorized']
    try{
        let reqRes=await serviceCall.callPostMethod(`/update?id=${id}`,req.body,header)
        res.send(reqRes.body)
    }catch(err){
        res.send(err)
    }
})
module.exports=router