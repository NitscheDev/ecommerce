const Product = require('../models/product')
const { v4: uuidv4 } = require('uuid')
const smart = require('smart-generator')

//Handlers
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

exports.postHandler = (req,res) => {
    //get action from req.query
    const { action } = req.query
    //check is an action was defined
    if (!action) return res.status(400).json({
        message: 'No action was defined in the request. Please provide a action in the query...?action=youraction',
        code: 400,
        ok: false
    })
    //run switch for each action
    switch(action) {
        case 'new':
            createProduct(req,res)
            break
        case 'edit':
            editProduct(req,res)
            break
        default:
            return res.status(400).json({
                message: 'Invalid action',
                actions: ['new','edit'],
                code: 400,
                ok: false
            })
    }
}


//Handler functions
const createProduct = (req,res) => {
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
    const id = smart.genId()
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

const editProduct = async (req,res) => {
    const { id } = req.query
    if (!id) return res.status(400).json({
        message: 'No product id was provieded in the request query',
        code: 400,
        ok: false
    })
    //get product from database with the id given
    Product.findOne({ _id: id },(error,result) => {
        if (error) return res.status(500).json({
            message: error,
            code: 500,
            ok: false
        })
        //check if result contains a product -> if not send back error
        if (result === null) return res.status(404).json({
            message: 'No product found',
            code: 404,
            ok: false
        })
        //desctucture req.body
        const { title, price, summary, description, category, featured } = req.body
        //update result(document)'s values to it's originals or the new ones provieded in req.body
        result.title = title ? title : result.title
        result.price = price ? price : result.price
        result.summary = summary ? summary : result.summary
        result.description = description ? description : result.description
        result.category = category ? category : result.category
        //special for featured since it can also be false which will lead to the style above not working
        if (featured === false) {
            result.featured = false
        } else {
            result.featured = true
        }
        //save the new document
        result.save().then(savedDoc => {
            res.json({
                result: savedDoc,
                code: 200,
                ok: true
            })
        }).catch(error => {
            return res.status(500).json({
                message: error,
                code: 500,
                ok: false
            })
        })
    })
}


//Helper functions
