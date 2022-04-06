const User = require('../models/user')
const Token = require('../models/token')
const jwt = require('jsonwebtoken')

exports.getUser = (query) => {
    return new Promise((resolve,reject) => {
        User.findOne(query, (error,response) => {
            if (error) reject(error)
            resolve(response)
        })
    })
}

exports.saveToken = (userId,token) => {
    return new Promise((resolve,reject) => {
        Token.create({ _userId: userId, token }, (error,response) => {
            if (error) reject(error)
            resolve(response)
        })
    })
}

exports.getToken = (userId) => {
    return new Promise((resolve,reject) => {
        Token.findOne({ _userId: userId }, (error,response) => {
            if (error) reject(error)
            if (response !== null) {
                //verify token
                jwt.verify(response.token,process.env.ACCESS_SECRET, (error,token) => {
                    if (error) {
                        response = null
                        //delete invalid token from database
                        Token.deleteOne({ _userId: userId }, (error) => {
                            if (error) reject(error)
                        })
                    }
                    resolve(response)
                })
            }
            resolve(response)
        })
    })
}