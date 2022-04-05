require('dotenv').config()
const express = require('express')
const connectDB = require('./config/db.conf')
const path = require('path')
const port = process.env.PORT || 5000
const app = express()

//Middlewere's
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//Routes
app.use('/api', require('./routes/api.route'))
app.use('/api/products', require('./routes/product.route'))

//MongoDB
connectDB(process.env.MONGO_URI)

//Start Server
app.listen(port, () => console.log(`Server alive at http://localhost:${port}`))