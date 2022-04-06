const mongoose = require('mongoose')

const User = new mongoose.Schema({
    _id: String,
    name: String,
    email: String,
    password: String,
    role: String,
    status: String,
    created: String
})

module.exports = mongoose.model('user', User, 'users')