const jwt = require('jsonwebtoken')
const { getToken } = require('../helpers/auth')
const { createError } = require('../helpers/http')
const Token = require('../models/token')

exports.requireAuth = async (req,res,next) => {
    const token = req.cookies.access_token
    if (token) {
        //a token was provieded in cookies do logic and verify it
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_SECRET)
            const userId = decoded._id
            getToken(userId).then(response => {
                //check if response from database contains anything or is null
                if (response === null) {
                    return createError(req,res,401,'Invalid or no access token')
                }
                const dbToken = response.token
                //verify and compare token from database
                if (dbToken === token) {
                    try {
                        jwt.verify(dbToken, process.env.ACCESS_SECRET)
                        //token from database is valid now let user pass to next
                        //req.cool = 'boom' -->
                        next()
                    } catch (error) {
                        //database token invalid
                        return createError(req,res,401,'Invalid or no access token')
                    }
                }
            }).catch(error => {
                //something went wrong when collecting token from database
                return createError(req,res,500,error)
            })
        } catch (error) {
            //delete invalid token from database -> getToken does this but only if the userId is provided
            //which it wont be in this case since the token in the cookie itself is invalid
            Token.deleteOne({ token }, (error) => {
                if (error) reject(error)
            })
            //invalid token
            return createError(req,res,401,'Invalid or no access token')
        }
    } else {
        //no access token
        return createError(req,res,401,'Invalid or no access token')
    }
}