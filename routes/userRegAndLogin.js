const express = require('express')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const user = require('../schema/UserSchema.js')
const router = express.Router()

const authKey = process.env.AUTH_KEY

router.post("/createuser", [

    body('email').isEmail(),
    body('password', 'Invalid Credentials').isLength({ min: 5 })

],
    async (req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password , salt)
        // console.log(hashedPassword)

        try {
            await user.create({
                name: req.body.name,
                location: req.body.location,
                email: req.body.email,
                password: hashedPassword
            }).then(
                res.json({ "success": "true" })
            )
        }
        catch (err) {
            res.json({ "success": "false" })
        }
    })

router.post("/login", [

    body('email').isEmail(),
    body('password', 'Invalid Credentials').isLength({ min: 5 })

], async (req, res) => {

    var email = req.body.email

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        let userData = await user.findOne({ email: email })
        if (!userData) {
            return res.status(400).json({ errors: "Try logging with credentials" })
        }

        const isPasswordSame = await bcrypt.compare(req.body.password , userData.password)

        if (!isPasswordSame) {
            return res.status(400).json({ errors: "Try logging with correct credemtials" })
        }
        else {
            const data = {
                user : {
                    id : userData._id
                }
            }
            const authToken = jwt.sign(data,authKey)
            return res.json({ success: true , authToken:authToken})
        }
    }
    catch (err) {
        res.json({ success: false })
    }
})

module.exports = router