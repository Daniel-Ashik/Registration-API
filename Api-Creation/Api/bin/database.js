const { resolve } = require('path/posix')
const {Pool}=require('pg')
let pgConfig={
    user:process.env.USER,
    host:process.env.HOST,
    database:process.env.DATABASE,
    password:process.env.PASSWORD,
    port:process.env.PG_PORT
}
const pool=new Pool(pgConfig)
module.exports={
    runQuery:function(query,params=[]){
        return new Promise((resolve,reject)=>{
            pool.connect((error,client,done)=>{
                if(error){
                    return reject(error)
                }
                client.query(query,params,(error,results)=>{
                    done()
                    if(error){
                        return reject(error)
                    }
                    return resolve(results)
                })
            })
        })
    },
    formatString: function (str) {
		return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
			switch (char) {
				case "\0":
					return "\\0";
				case "\x08":
					return "\\b";
				case "\x09":
					return "\\t";
				case "\x1a":
					return "\\z";
				case "\n":
					return "\\n";
				case "\r":
					return "\\r";
				case "\"":
				case "'":
				case "\\":
				case "%":
					return "\\" + char; // prepends a backslash to backslash, percent, and double/single quotes
				default:
					return char;
			}
		});
	}
}