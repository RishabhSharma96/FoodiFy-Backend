const express = require('express')
const router = express.Router()

router.post("/fooddata" , (req,res) => {
    try {
        res.send([global.food_data , global.food_category_data])
        // console.log(global.food_data , global.food_category_data)
    } catch (err) {
        console.log(err)
        res.send("Server Error")
    }
})

module.exports = router 