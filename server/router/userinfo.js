//獲取用戶訊息的api

const express = require('express')
const router = express.Router()

const userinfo_handler = require('../router_handler/userinfo')
router.get('/getuserinfo',userinfo_handler.getuserinfo)

module.exports =router