const express=require('express')
let app=express()
let morgan=require('morgan')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/',require('./routes/index'))
app.use(morgan('dev'))

module.exports=app