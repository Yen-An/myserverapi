const express = require('express')
const router = express.Router()




const userhandler = require('../router_handler/giftinfo')

router.get('/giftinfo',userhandler.giftinfo)
router.get('/delgiftinfo',userhandler.delgiftinofo)
router.post('/newgift',userhandler.newgift)
router.get('/giftstock',userhandler.giftstock)
router.get('/updatestock',userhandler.updatestock)
router.get('/getapplygift',userhandler.getapplygift)
router.get('/whoareyou',userhandler.whoareyou)
router.get('/waitforaccpet',userhandler.waitforaccpet)
router.get('/denyoraccpet',userhandler.denyoraccpet)

module.exports=router