const Config=require('../Config/localhost')
for(let key in Config){
    process.env[key]=Config[key]
}
global.db=require('./database')
const http=require('http')
let app=require('../app')
let server=http.createServer(app)
var port=process.env.port || '3059'
app.set('port',port)
server.listen(port)
