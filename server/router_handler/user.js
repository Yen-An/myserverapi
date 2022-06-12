const db= require('../config/db')
const jwt = require('jsonwebtoken') //生成token
const config = require('../config')


//登入用戶處理函數
exports.signin=(req,res)=>{
    //接收表單數據
    const userinfo = req.body
    //帳密是否與資料庫相同
    const sqlstr = 'select * from person_info where userid=?'
    //sql
    db.query(sqlstr,userinfo.userid,(err,results)=>{
        if(err) return res.send(err)
        if(results.length !==1) {
            return res.send({error:'沒有這個帳號'})
        }
        if(results[0].userpwd!==userinfo.password) {
            return res.send({error2:'密碼錯誤'})
        }
        //正確了，在server生成token string
        //console.log(user)
        const user ={...results[0],userpwd:''} //剔除敏感資訊
        //console.log(user)
        //帳號加密
        const tokenstr = jwt.sign(user,config.jwtsecertkey,{expiresIn:config.expiresIn})
        //console.log(tokenstr)
        //把token回傳client
        res.send({
            status:0,
            message:'登入成功',
            token:tokenstr,
        })
        //console.log(user)
        
    })
}

