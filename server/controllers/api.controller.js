const User = require('../models/user')

exports.main = (req,res) => {
    console.log(req.query)
    User.find({ name: 'Rasmus Nitsche' }, (error,results) => {
        if (error) return console.log(error)
        res.json({
            results,
            ok: true
        })
    })
}