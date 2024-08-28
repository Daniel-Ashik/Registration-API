const needle=require('needle')
module.exports={
    callGetMethod:function(url,headers={}){
        return new Promise((resolve,reject)=>{
            needle.get(`${process.env.apiHost}${url}`,{headers:{authorized:headers}},function(error,response,body){
                if(error){
                    return reject(error)
                }
                return resolve(response)
            })
        })
    },
    callPostMethod:function(url,obj,headers={}){
            return new Promise((resolve,reject)=>{
            needle.post(`${process.env.apiHost}${url}`,obj,{headers:{authorized:headers}},function(error,response,body){
                if(error){
                    return reject(error)
                }
                return resolve(response)
            })
        })
    }
}
