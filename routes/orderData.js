const express = require('express')
const router = express.Router()

const Order = require('../schema/Orders.js')

router.post('/orderdata', async (req, res) => {
    let data = req.body.order_data
    // console.log(data)
    await data.splice(0, 0, { Order_date: req.body.order_date })
    // console.log(req.body.order_date)
    let databaseData = await Order.find({ email: req.body.email })
    console.log(databaseData)
    // console.log(req.body.email)
    console.log(data)
    if (databaseData !== []) {
        console.log("try1");
        try {
            console.log("try");
            await Order.create({
                email: req.body.email,
                order_data: [data]
            }).then(() => {
                res.json({ success: true })
            })
        }
        catch (error) {
            console.log("try2")
            await Order.findOneAndUpdate({ email: req.body.email },
                { $push: { order_data: data } }).then(() => {
                    res.json({ success: true })
                })
        }
    }
})

router.post('/myorderdata', async (req, res) => {
    try {
        let dataFood = await Order.find({ email: req.body.email })
        res.json({ orderData: dataFood })
    }
    catch (err) {
        res.json({ error: err })
    }
})

module.exports = router