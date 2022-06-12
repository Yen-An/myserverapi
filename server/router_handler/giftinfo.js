const db = require("../config/db");
const fs = require("fs");
const { resourceLimits } = require("worker_threads");


//確認權限的api
exports.whoareyou =(req,res)=>{
    if(req.auth.userid==='T80482' ||req.auth.userid==='T80007'){
        res.send({
            status:0,
            message:'權限OK',
        })
    }else{
        res.send({
            status:1,
            message:'沒有權限'
        })
    }
    //console.log(req.headers.userid)
    //console.log(res)
}

//取得禮品資訊
exports.giftinfo = (req, res) => {
  const username = req.auth.username;
  const search = decodeURI(req.headers.searchindex).replace(" ", ""); //英文decode完會多空格，做字串處理用掉
  //console.log(search)
  if (req.headers.searchindex !== "") {
    const sqlstr =
      "select * from  gift_info where state='啟用' and giftname like ? ";
    db.query(sqlstr, "%" + search + "%", (err, results) => {
      //console.log(results)
      //console.log(sqlstr)
      if (err) {
        return res.send({ error2: "SQL查詢失敗" });
      }
      if (results.length === 0) {
        return res.send({
          status: 0,
          message: "查無資料！",
          data: "",
        });
      }
      res.send({
        status: 0,
        message: ` ${username} 載入禮品訊息成功`,
        data: results,
      });
      console.log(results);
    });
  } else {
    //console.log("null");
    const sqlstr = 'select * from  gift_info where state="啟用" ';
    db.query(sqlstr, (err, results) => {
      //console.log(results)
      if (err) return res.send({ error: "hereerror" });
      //if (results.length !== 1) return res.send({ error: "thiserror" });
      res.send({
        status: 0,
        message: ` ${username} 載入禮品訊息成功`,
        data: results,
      });
    });
  }
  //console.log(req.headers.test) //自定義要挾帶的參數
  //console.log(username)
};
//停用禮品api
exports.delgiftinofo = (req, res) => {
  console.log(req.headers);
  const username = req.auth.username;
  //res.send('here can update gift infomations.')
  console.log("here can update gift infomation.");
  const colgiftid = req.headers.colgiftid;
  const colvalue = "停用";
  const sqlstr = "update gift_info set state=? where giftid=?";
  db.query(sqlstr, [colvalue, colgiftid], (err, results) => {
    console.log("sql start");
    if (err) {
      return res.send({
        status: 1,
        message: "something error",
      });
    }
    if (results.affectedRows !== 1) {
      return res.send({
        status: 1,
        message: "update-error",
      }); //更新不成功
    }
    res.send({
      status: 0,
      message: "刪除成功！",
    });
  });
};

//新增禮品的api
exports.newgift = (req, res) => {
  //console.log(req.auth.userid);
  // console.log(req)
  // console.log(req.files)
  //先確認四類資料庫內已經寫入的資料筆數
  const sel_sqlstr = "select count(giftid) as countgift from gift_info ";
  db.query(sel_sqlstr, (err, results) => {
    let giftcounter = JSON.stringify(results[0].countgift + 1)
      .toString()
      .padStart(4, "0");
    const newgiftid = `${req.headers.selopt}${req.auth.userid}${giftcounter}`;
    const newgiftprice = Number(req.headers.giftprice);
    // console.log(newgiftprice);
    // console.log(newgiftid);
    if (err) {
      console.log(err);
    }
    //result 是現在的資料筆數，+1就是這次要寫入資料庫的流水號
    const sqlstr = "insert into gift_info  set?";
    db.query(
      sqlstr,
      {
        giftid: newgiftid,
        giftname: req.headers.filename,
        giftprice: newgiftprice,
        giftclass: req.headers.selopt,
        remark: req.headers.remark,
        state: "啟用",
        ectdate: req.headers.ectdate,
      },
      (err, results) => {
        if (err) {
          console.log(err);
          res.send({
            status: 1,
            message: err,
          });
        }
        // 如果增加行數不是1就是新增失敗
        if (results.affectedRows !== 1) {
          res.send({
            status: 1,
            message: "Create New Gift Infomation failed",
          });
        }
        //新增成功，檔案寫入指定路徑
        fs.writeFile(
          `../gift/public/image/${newgiftid}.png`,
          req.files.file.data,
          "binary",
          function (err) {
            console.log(err);
          }
        );
        res.send({
          status: 0,
          message: "成功新增！",
        });
      }
    );
  });
  //console.log(req.headers);
  //console.log(req.files.file.data)
  // console.log(req.auth.username)
};

//取得庫存資訊
exports.giftstock = (req, res) => {
  const username = req.auth.username;
  const search = decodeURI(req.headers.searchindex).replace(" ", ""); //英文decode完會多空格，做字串處理用掉
  //console.log(search)
  if (req.headers.searchindex !== "") {
    const sqlstr =
      "select * from  stocklist where state='啟用' and giftname like ? ";
    db.query(sqlstr, "%" + search + "%", (err, results) => {
      //console.log(results)
      //console.log(sqlstr)
      if (err) {
        return res.send({ error2: "SQL查詢失敗" });
      }
      if (results.length === 0) {
        return res.send({
          status: 0,
          message: "查無資料！",
          data: "",
        });
      }
      res.send({
        status: 0,
        message: ` ${username} 載入禮品訊息成功`,
        data: results,
      });
      //console.log(results);
    });
  } else {
    //console.log("null");
    const sqlstr = 'select * from  stocklist where state="啟用" ';
    db.query(sqlstr, (err, results) => {
      //console.log(results)
      if (err) {
        console.log("here!");
        return res.send({
          error: "hereerror",
        });
      }
      //if (results.length !== 1) return res.send({ error: "thiserror" });
      res.send({
        status: 0,
        message: ` ${username} 載入禮品訊息成功`,
        data: results,
      });
    });
  }
  //console.log(req.headers.test) //自定義要挾帶的參數
  //console.log(username)
};

//更新庫存數量（領用另外寫一個就好）
exports.updatestock = (req, res) => {
  //console.log('here can update stock volume!')
  //console.log(req.auth)
  //console.log(req.headers);  
  const sqlstr = "select count(get_id) as count from getgift_rec";
  db.query(sqlstr, (err, results) => {
    const selopt = decodeURI(req.headers.selopt)
    if (err) {
      res.send({
        status: 1,
        message: err,
      });
    } else {
      let counter = JSON.stringify(results[0].count + 1)
        .toString()
        .padStart(6, "0");
      const getid = `${req.auth.userid}${counter}`;
      //console.log(selopt)
      //console.log(results[0].count)
      const sqlstr = "insert into getgift_rec set?";
      //因為這個api是專門給管理者管理庫存用的，不需審核，直接設通過
      db.query(
        sqlstr,
        {
          giftid: req.headers.giftid,
          username: req.auth.username,
          userid: req.auth.userid,
          actionclass:selopt,
          volume: req.headers.newvolume,
          getdate: new Date(),
          state:"通過",
          get_id:getid,
          checkdate:new Date(),
          getreason:decodeURI(req.headers.remark)
        },
        (err, results) => {
            if(err){
                res.send({
                    status:1,
                    message:err
                })
            }else if(results.affectedRows!=0)
            res.send({
              status: 0,
              message: "success",
            });
            //console.log(results)
        }
      );
    }
  });

};

//領用禮品
exports.getapplygift=(req,res)=>{
    const sqlstr = "select count(get_id) as count from getgift_rec";
    db.query(sqlstr, (err, results) => {
      if (err) {
        res.send({
          status: 1,
          message: err,
        });
      } else {
        let counter = JSON.stringify(results[0].count + 1)
          .toString()
          .padStart(6, "0");
        const getid = `${req.auth.userid}${counter}`;
        //console.log(selopt)
        //console.log(results[0].count)
        const sqlstr = "insert into getgift_rec set?";
        db.query(
          sqlstr,
          {
            giftid: req.headers.giftid,
            username: req.auth.username,
            userid: req.auth.userid,
            actionclass:"領用",
            volume: req.headers.newvolume,
            getdate: new Date(),
            state:"待審核",
            get_id:getid,
            getreason:decodeURI(req.headers.remark)
          },
          (err, results) => {
              if(err){
                  res.send({
                      status:1,
                      message:err
                  })
              }else if(results.affectedRows!=0)
              res.send({
                status: 0,
                message: "success",
              });
              //console.log(results)
          }
        );
      }
    });
};

//取得待審核審核禮品
exports.waitforaccpet = (req,res) =>{
    const sqlstr = 'select getgift_rec.* ,stocklist.stock,stocklist.giftname  from getgift_rec LEFT JOIN stocklist on getgift_rec.giftid  = stocklist.giftid  where getgift_rec.state="待審核"'
    db.query(sqlstr,(err,results)=>{
        if(err){
            res.send({
                status:1,
                message:err
            })
        }
        res.send({
            status:0,
            message:'success',
            data:results
        })
        //console.log(results)
    })
}
//審核
exports.denyoraccpet = (req,res)=>{
    //console.log(req.headers)
    const sqlstr = 'update getgift_rec set state=?, checkdate=? where get_id=?'
    const newstate = decodeURI(req.headers.selopt)
    const newdate = new Date()
    db.query(sqlstr,[
        newstate,
        newdate,
    req.headers.get_id],(err,results)=>{
        if(err){
            res.send({
                status:1,
                message:'失敗審核'
            })
        }
        else if(results.affectedRows !== 1){
            res.send({
                status:1,
                message:'更新庫存失敗'
            })
        }else{
            res.send({
                status:0,
                message:'審核成功'
            })
        }
    })    
}
