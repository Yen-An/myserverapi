const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require('express-fileupload');
//bodyParser是用來獲取前端傳來的body資料！
//以前有內建現在沒有了，一定要在所有路由之前宣告
app.use(fileUpload());
app.use(bodyParser.json());
//解析表單數據
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

//解析token的middleware
const { expressjwt } = require("express-jwt");
const config = require("./config"); //我的金鑰
app.use(
  expressjwt({ secret: config.jwtsecertkey, algorithms: ["HS256"] }).unless({
    path: [/^\/api/],
  })
);

//導入並使用驗證登入的模塊
const userrouter = require("./router/user");
app.use("/api", userrouter);
//使用用戶訊息的路由
const userinforouter = require('./router/userinfo')
app.use('/my',userinforouter)
//導入獲取禮品訊息的模塊
const giftinforouter = require('./router/giftinfo')
app.use('/my',giftinforouter)

// const db = require('./config/db')
//登入的api
// app.post('/signin',(req,res)=>{
//     const {userid,password} = req.body;
//     db.query(
//         `select * from person_info where userid = '${userid}' AND userpwd='${password}'`,
//         function(err,rows,fields){
//             if(rows.length===0)
//             {
//                 return res.send({error :'帳號不存在或帳密有誤!!'})
//             }
//             return res.send({message:'登入成功'})
//         }
//     )
// })

//導入錯誤級別的中間件
app.use((err,req,res,next)=>{
    if(err.name ==='UnauthorizedError'){
        return res.send({
            error:'登入異常，請重新登入'}) //這個要記得是header資料，不是body
    }
    //未知的錯誤
    console.log('sdfsdf')
    console.log(err)
    res.send({
        status:1,
        message:'未知的失敗'})
})

app.listen(3033, () => {
  console.log("server starting");
});
