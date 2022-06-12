const express = require('express')
const router = express.Router()

const userhandler = require('../router_handler/user')

router.post('/signin',userhandler.signin)

module.exports=router