
exports.createError = (req,res,code,message) => {
    if (!req || !res || !code || !message) throw new Error('All parameters is required -> createError()')
    return res.status(code).json({
        message,
        code
    })
}

exports.success = (res,message,payload) => {
    return res.status(200).json({
        message,
        data:payload
    })
}