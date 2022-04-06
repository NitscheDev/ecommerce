const User = require('../models/user')
const smart = require('smart-generator')
const bcrypt = require('bcryptjs')
const valix = require('valix')
const jwt = require('jsonwebtoken')
const { createError, success } = require('../helpers/http')
const { getUser, saveToken, getToken } = require('../helpers/auth')

exports.seed = (req,res) => {
    const pass = bcrypt.hashSync('test1234', 10)
    User.create({
        _id: smart.genId(12),
        name: 'Rasmus Nitsche',
        email: 'example@admin.com',
        password: pass,
        role: 'admin',
        status: 'active',
        created: new Date().toLocaleString()
    }, (error,result) => {
        if (error) return res.status(500).json({
            message: error,
            code: 500,
            ok: false
        })
        if (result) {
            return res.json({
                message: 'A user was seeded into the database',
                code: 200,
                ok: true
            })
        } else {
            return res.status(500).json({
                message: 'Oops. Something went wrong!',
                code: 500,
                ok: false
            })  
        }
    })
}

exports.loginHandler = async (req,res) => {
    const { email, password } = req.body
    //validate data
    if (!email || !password) return createError(req,res,400,'Email and password is requried')
    if (!valix.isEmail(email)) return createError(req,res,400,'Email is invalid')
    //check if user exist in database
    try {
        const user = await getUser({ email })
        //check if a user was found
        if (user === null) return createError(req,res,400,'Incorrect email or password')
        //compare hashed password to plain text one
        if (!bcrypt.compareSync(password,user.password)) return createError(req,res,400,'Incorrect email or password')
        //check if account is frozen
        if (user.status === 'frozen') return createError(req,res,400,'Account frozen')
        //check if token is in database
        let response = await getToken(user._id)
        let token = null
        if (response === null) {
            //no token in database generate new and save to database and also set to local let
            token = jwt.sign({ _id: user._id, role: user.role }, process.env.ACCESS_SECRET, { expiresIn: '90days' })
            try {
                await saveToken(user._id, token)
            } catch (error) {
                return createError(req,res,500,'Oops. Something went wrong')
            }
        } else {
            //set local token let to database token
            token = response.token
        }
        //set token as cookie on http-response
        res.cookie('access_token', token, { httpOnly: true })
        //success response
        success(res, 'Login Successful', { user })
    } catch (error) {
        return createError(req,res,500,error)
    }
}

exports.protected = (req,res) => {
    const lol = req.cool
    res.send('Hello World ' + lol)
}