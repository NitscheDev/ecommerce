const mongoose = require('mongoose')

const Token = new mongoose.Schema({
    _userId: String,
    token: String
})

module.exports = mongoose.model('token', Token, 'tokens')