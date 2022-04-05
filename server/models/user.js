const mongoose = require('mongoose')

const User = new mongoose.Schema({
    name: String
})

module.exports = mongoose.model('user', User, 'users')