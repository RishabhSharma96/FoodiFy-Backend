require('dotenv').config()
require('./connection.js')
const express = require('express')
const cors = require('cors')


const server = express() 
const port = process.env.PORT || 5000

server.use(express.json())

server.use(cors())

server.get("/"  ,(req,res)=>{
    res.send("running")
})

server.use(express.json())
server.use('/api' , require('./routes/userRegAndLogin.js'))
server.use('/api' , require('./routes/displayData.js'))
server.use('/api' , require('./routes/orderData.js'))

server.listen(port , () => {
    console.log(`Server is running on port ${port}`)
})