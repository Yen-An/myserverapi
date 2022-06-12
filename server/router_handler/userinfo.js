//獲取用戶訊息
const db = require("../config/db");

//獲取的函數
exports.getuserinfo = (req, res) => {
  //console.log(req.auth);
  const sqlstr =
    "select userid,username,userident,userunit,unitid from person_info where userid=?";
  db.query(sqlstr, req.auth.userid, (err, results) => {
    if (err) return res.send({ error: "error" });
    if (results.length !== 1) return res.send({ error: "error" });
    res.send({
      status: 0,
      message: "獲取用戶訊息成功",
      data: results[0],
    });
  });
};
