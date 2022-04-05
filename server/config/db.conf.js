const mongoose = require('mongoose')

function connectDB(uri) {
    //check uri length to be atleast over 0
    if (uri.length > 0) {
        mongoose.connect(uri).then(() => {
            console.log('MongoDB Connected...')
        }).catch(error => {
            console.log('MongoDB: ' + error)
        })
    } else {
        console.log('No MongoDB Credentials given -> MongoDB NOT Connected')
    }
}

module.exports = connectDB