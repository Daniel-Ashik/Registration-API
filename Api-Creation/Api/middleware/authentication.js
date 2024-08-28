const jwt = require('jsonwebtoken')
module.exports = {
    userAuthorized: function (req, res, next) {
        const token = req.header("authorized")
        let tt=token
        if(tt.toLowerCase().startsWith('bearer')){
            tt=token.split(" ")[1]
        }
        try{
            let body=jwt.verify(token,process.env.JWT_SECRET_KEY)
            if(body){
                next()
            }else{
                if(!body){
                   return res.status(401).send({message: "Authentication Invalid"})
                }
            }
        }
        catch(err){
            console.error(err)
            res.status(601).send({errors: err.message})
            return
        }
        if(!token.startsWith('Bearer')|| !req.headers.authorized){
            req.headers.authorized=`Bearer ${token}`
        }
    }

}