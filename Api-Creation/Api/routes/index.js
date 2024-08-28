var express = require('express')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
var { userAuthorized } = require('../middleware/authentication')
var router = express.Router()
router.post('/create', async function (req, res, next) {
    let errors = {}
    let body = req.body
    // console.log(req.body)
    if (typeof body !== 'object') {
        try {
            body = JSON.parse(body)
        } catch (err) {
            if (!Object.keys(errors).includes('action')) {
                errors.action = []
            }
            errors.action.push(`unable to parse req body. ${err.message}`)
        }
    }
    let body_name, body_password, body_email, body_phone
    if (Object.keys(errors).length === 0) {
        let bodyKeys = Object.keys(body)

        createdon_func = new Date().getTime()
        if (bodyKeys.includes('name') && body.name !== '') {
            body_name = body.name
        } else {
            if (!Object.keys(errors).includes('name')) {
                errors.name = []
            }
            errors.name.push('Name must be provide an value')
        }

        if (bodyKeys.includes('password') && body.password !== '') {
            let pass = await bcrypt.hash(body.password, 10)
            body_password = pass

            console.log(pass)
        } else {
            if (!Object.keys(errors).includes('password')) {
                errors.password = []
            }
            errors.password.push('password must be provide an value')
        }

        if (bodyKeys.includes('email') && body.email !== '') {
            body_email = body.email
        } else {
            if (!Object.keys(errors).includes('email')) {
                errors.email = []
            }
            errors.email.push('email must be provide an value')
        }

        if (bodyKeys.includes('phone') && body.phone !== '') {
            body_phone = body.phone
        } else {
            if (!Object.keys(errors).includes('phone')) {
                errors.phone = []
            }
            errors.phone.push('phone must be provide an value')
        }
    }

    let users_output
    if (Object.keys(errors).length === 0) {
        try {
            let sql_insert_query = `INSERT INTO Persons(
                name,password,email,phone) VALUES
                ('${global.db.formatString(body_name)}','${global.db.formatString(body_password)}',
                '${global.db.formatString(body_email)}','${global.db.formatString(body_phone)}')RETURNING*`
            let query_users_result = await global.db.runQuery(sql_insert_query)
            users_output = query_users_result.rows[0]
        } catch (err) {
            if (!Object.keys(errors).includes('action')) {
                errors.action = []
            }
            errors.action.push(`unable to complete the operation. ${err.message}`)
        }
    }
    if (Object.keys(errors).length === 0) {
        users_output.password = undefined
        res.status(200).send({
            status: 'SUCCESS!',
            users: users_output
        })
    } else {
        res.status(601).send({
            ststus: 'ERROR!',
            errors: errors
        })
    }
})

router.post('/login', async function (req, res, next) {
    let errors = {}
    let body = req.body
    if (typeof body !== 'object') {
        try {
            body = JSON.parser(body)
        } catch (err) {
            if (!Object.keys(errors).includes('action')) {
                errors.action = []
            }
            errors.action.push(`unable to parse req body. ${err.message}`)
        } 0
    }
    let body_name, body_password, body_email
    if (Object.keys(errors).length == 0) {
        let bodyKeys = Object.keys(body)

        if (bodyKeys.includes('name') && body.name !== '') {
            body_name = body.name
        } else {
            if (!Object.keys(errors).includes('name')) {
                errors.name = []
            }
            errors.name.push('name must be provide with an value')
        }

        if (bodyKeys.includes('password') && body.password !== '') {
            body_password = body.password
        } else {
            if (!Object.keys(errors).includes('password')) {
                errors.password = []
            }
            errors.password.push('password must be provide with an value')
        }
        if (bodyKeys.includes('email') && body.email !== '') {
            body_email = body.email
        } else {
            if (!Object.keys(errors).includes('email')) {
                errors.email = []
            }
            errors.email.push('email must be provide an value')
        }
    }
    let users_output
    if (Object.keys(errors).length === 0) {
        try {
            let sql_get_query = `SELECT * FROM public.persons WHERE
            persons.name='${global.db.formatString(body_name)}'AND
            persons.email='${global.db.formatString(body_email)}'`
            let query_users_result = await global.db.runQuery(sql_get_query)
            users_output = query_users_result.rows[0]
            // console.log(users_output)
            if (users_output === undefined) {
                errors.action = []
                errors.action.push('name or password has not defined registered here!')
            } else {
                if (query_users_result.rows.length === 0) {
                    errors.name = []
                    errors.name.push('user dosent exist')
                }
                else {
                    let password = await bcrypt.compare(body_password, query_users_result.rows[0].password)
                    if (!password) {
                        errors.password = []
                        errors.password.push('password do not match try again')
                    }
                }
            }
        } catch (err) {
            if (!Object.keys(errors).includes('action')) {
                errors.action = []
            }
            errors.action.push(`unable to complete the operation. ${err.message}`)
        }
    }
    let action = 'redirect'
    if (Object.keys(errors).length === 0) {
        const token = jwt.sign({ name: body_name, password: body_password }, process.env.JWT_SECRET_KEY)
        // console.log(token)
        users_output.password = undefined

        res.status(200).send({
            status: 'SUCCESS!',
            message: 'Login Success',
            token: token,
            user: users_output
        })
    } else {
        res.status(601).send({
            status: 'ERROR',
            errors: errors
        })
    }
})

router.get('/get', async function (req, res, next) {
    let errors = {}
    let body = req.body
    // console.log(req.body)
    if (typeof body !== 'object') {
        try {
            body = JSON.parse(body)
        } catch (err) {
            if (!Object.keys(errors).includes('action')) {
                errors.action = []
            }
            errors.action.push(`unable to parse req query. ${err.message}`)
        }
    }
    let body_name
    let apiList = []
    if (Object.keys(errors).length === 0) {
        let bodyKeys = Object.keys(body)
        if (bodyKeys.includes('name')) {
            body_name = body.name
            apiList.push(`persons name='${global.db.formatString(body_name)}'`)
            try {
                let referenceValidationCheck_body_name = await global.db.runQuery(`SELECT name FROM public.persons WHERE name='${global.db.formatString(body_name)}'`)
                // console.log(referenceValidationCheck_body_name.rows)
                if (referenceValidationCheck_body_name.rows.length === 0) {

                    if (!Object.keys(errors).includes('name')) {
                        errors.name = []
                    }
                    errors.name.push('name is provide an invalide value')
                }
            } catch (err) {
                if (!Object.keys(errors).includes('name')) {
                    errors.name = []
                }
                errors.name.push(`unable to validate the correctness value. ${err.message}`)
            }
        }
        else {

            if (!Object.keys(errors).includes('name')) {
                errors.name = []
            }
            errors.name.push('name must be provide value')
        }
    }

    let users_output
    if (Object.keys(errors).length === 0) {
        try {
            let sql_get_query = `SELECT name FROM persons WHERE
            persons.name='${global.db.formatString(body_name)}'`
            let sql_get_query_result = await global.db.runQuery(sql_get_query)
            // console.log(sql_get_query)
            users_output = sql_get_query_result.rows[0]
            // console.log(sql_get_query_result.rows[0])
        } catch (err) {
            if (!Object.keys(errors).includes('action')) {
                errors.action = []
            }
            errors.action.push(`unable to complete the operation. ${err.message}`)
        }
    }

    if (Object.keys(errors).length === 0) {
        res.status(200).send({
            status: 'SUCCESS!',
            users: users_output
        })
    } else {
        res.status(601).send({
            status: 'ERROR!',
            errors: errors
        })
    }
})

router.get('/welcome', userAuthorized, async function (req, res, next) {
    let id = req.query.id
    let sql_get_query = `SELECT name,email,phone FROM public.persons WHERE id=${id}`
    try {
        let sql_get_query_result = await global.db.runQuery(sql_get_query)
        users_output = sql_get_query_result.rows[0]
        // console.log(users_output)
        res.status(200).send({
            status: 'SUCCESS!',
            users: users_output,
        })
    } catch (err) {
        console.log(err)
        res.status(601).send({
            status: 'ERROR!'
        })
    }

})

router.get('/view',async function(req,res,next){
    let id=req.query.id
    let sql_get_query=`SELECT name,email,phone FROM public.persons WHERE id=${id}`
    try{
        let sql_get_query_result =await global.db.runQuery(sql_get_query)
        // console.log(sql_get_query_result)
        users_output=sql_get_query_result.rows[0]
        res.status(200).send({
            status:'SUCCESS!',
            users:users_output
        })
    }catch(err){
        console.log(err)
        res.status(601).send({
            status:'ERROR!'
        })
    }
})

router.post('/update', userAuthorized, async function (req, res, next) {
    let obj_keys = ['name', 'phone','email']
    if (!req.body.users) {
        // console.log(req)
        return res.status(204).send({
            status: 'ERROR!',
            message: 'update field should not be empty'
        })
    } else {
        let data_keys = Object.keys(req.body.users)
        if (data_keys.includes('password')) {
            return res.status(400).send({
                status: 'ERROR!',
                message: 'should not be change'
            }) 
        } else {
            isData = data_keys.every((element) => obj_keys.includes(element))
            if (isData) {
                data_keys = data_keys.filter(e => {
                    return req.body.users[e].length != 0
                })
                let updateOn = new Date().toString()
                let query = 'UPDATE public.persons SET ' + data_keys.map(key => `${global.db.formatString(key)}='${global.db.formatString(req.body.users[key])}'`).join(',') + ` WHERE id=${global.db.formatString(req.query.id)} RETURNING*`
                try {
                    let query_result = await global.db.runQuery(query)
                    let final_data = query_result.rows[0]
                    final_data.password = final_data.createdon = undefined
                    return res.status(200).send({
                        status: 'SUCCESS!',
                        data: final_data
                    })
                } catch (err) {
                    return res.status(204).send({
                        status: 'ERROR',
                        errors:err
                    })
                }
            } else {
                res.status(404).send({
                    status: 'ERROR!',
                    error: 'data not found'
                })
            }
        }
    }
})

router.post('/delete',userAuthorized,async function(req,res){
    if(req.query.id){
        let query=`DELETE FROM persons WHERE id=${req.query.id} RETURNING*`
        console.log()
        try{
            let query_result=await global.db.runQuery(query)
            let final_data=query_result.rows[0]
            return res.status(200).send({
                status:'SUCCESS!',
                data:final_data
            })
        }catch(err){
            return res.status(204).send({
                status:'ERROR!',
                message:'data field should not be empty'
            })
        }
    }else{
        return res.status(204).send({
            status:'ERROR!',
            message:'data field should not be empty'
        })
    }
})

router.get('/getusers',userAuthorized,async function(req,res){
    let query='SELECT name,email,phone,id FROM public.persons'
    let query_users_result=await global.db.runQuery(query)
    let users=query_users_result.rows
    res.send({
        status:'SUCCESS!',
        users
    })
})

module.exports = router