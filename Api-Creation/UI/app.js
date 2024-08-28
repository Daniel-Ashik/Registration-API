var createError=require('http-errors')
var express=require('express')
var path=require('path')
var cookieParser=require('cookie-parser')
var morgan=require('morgan')
var bodyParser=require('body-parser')
var app=express()


app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname,'public')))
app.use(express.static(path.join(__dirname,'css')))

app.use('/',require('./routes/index'))
app.use('/users',require('./routes/users'))

// app.use(function(req,res,next){
//     next(createError(404))
// })

module.exports=app