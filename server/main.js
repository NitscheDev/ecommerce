require('dotenv').config()
const express = require('express')
const connectDB = require('./config/db.conf')
const cookieParser = require('cookie-parser')
const path = require('path')
const port = process.env.PORT || 5000
const app = express()

//Middlewere's
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

//Routes
app.use('/api/auth', require('./routes/auth.route'))
app.use('/api/products', require('./routes/product.route'))

//MongoDB
connectDB(process.env.MONGO_URI)

//Start Server
app.listen(port, () => console.log(`Server alive at http://localhost:${port}`))