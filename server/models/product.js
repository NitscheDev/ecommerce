const mongoose = require('mongoose')

const Product = new mongoose.Schema({
    _id: String,
    title: String,
    price: Number,
    summary: String,
    description: String,
    category: String,
    created: String,
    featured: Boolean
})

module.exports = mongoose.model('product', Product, 'products')