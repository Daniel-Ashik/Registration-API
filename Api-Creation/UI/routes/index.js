var express=require('express')
var router=express.Router()
let serviceCall=require('./apicall')
router.get('/',function(req,res){
    res.render('home')
})
router.get('/login',function(req,res){
    res.render('login')
})
router.get('/welcome',function(req,res){
    let id=req.query.id
    res.render('welcome',{id})
})
router.get('/getusers',function(req,res){
    res.render('user_list')
})
router.get('/delete',function(req,res){
    res.render('user_list')
})
router.get('/view',function(req,res){
    let id=req.query.id
    res.render('view',{id})
})
module.exports=router