const Product = require('../models/product')
const { v4: uuidv4 } = require('uuid');

exports.getHandler = (req,res) => {
    //check if a id is found in request query -> return single product with that id
    if (req.query.id) {
        const id = req.query.id
        Product.findOne({ _id: id }, (error,results) => {
            if (error) return res.status(500).json({
                message: error,
                code: 500,
                ok: false
            })
            if (results) {
                return res.json({
                    result: results,
                    code: 200,
                    ok: true
                }) 
            }
            return res.status(404).json({
                message: 'No product found',
                code: 404,
                ok: false
            })
        })
    } else {
        //return all products from collection
        Product.find((error,results) => {
            if (error) return res.status(500).json({
                message: error,
                code: 500,
                ok: false
            })
            if (results.length > 0) {
                return res.json({
                    result: results,
                    code: 200,
                    ok: true
                }) 
            }
            return res.status(404).json({
                message: 'No products found',
                code: 404,
                ok: false
            })
        })
    }
}

exports.createProduct = (req,res) => {
    //destructure needed data from req.body
    const { title, price, summary, description } = req.body
    let { category, featured } = req.body
    //validate so we got required data
    if (!title) return res.status(400).json({ message: 'Title is required', code: 400, ok: false })
    if (!price) return res.status(400).json({ message: 'Price is required', code: 400, ok: false })
    if (!summary) return res.status(400).json({ message: 'Summary is required', code: 400, ok: false })
    if (!description) return res.status(400).json({ message: 'Description is required', code: 400, ok: false })
    //check if a category was provided else set it to 'uncategorized'
    if (!category) category = 'uncategorized'
    //check if featured was provieded else set to false
    if (!featured) featured = false
    //generate id
    const id = uuidv4()
    //save new product to database
    Product.create({
        _id: id,
        title,
        price,
        summary,
        description,
        category,
        created: new Date().toLocaleString(),
        featured
    }, (error, result) => {
        if (error) return res.send(error)
        res.json(result)
    })
}
