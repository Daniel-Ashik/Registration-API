const config=require('../config/localhost')
Object.keys(config).forEach(key=>{
    process.env[key]=config[key]
})
let port=process.env.port || 8002
let http=require('http')
let app=require('../app')
let server=http.createServer(app)
server.listen(port)
app.set('port',port)