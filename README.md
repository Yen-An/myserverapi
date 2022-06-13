# 含有CURD及登入驗證功能之Express Api
# 如何使用

## 下載全部使用的套件

`$npm i`

## 啟動Express Server

`$nodemon server`



## API文件

### 用戶登入

|                       說明                        | Method |  Path   |
| :-----------------------------------------------: | :----: | :-----: |
| 用戶登入，成功後將user資訊敏感資訊剔除並返回token |  Post  | /signin |

##### Parameters

Body

```js
{
	userid:string,
	userpwd:string,
}
```

Example

```js
{
	userid:"T00001",
	userpwd:"aabbcc",
}
```



- 兩者皆為必填項。

##### Response

| code   | Description                            |
| ------ | -------------------------------------- |
| error  | 帳號不存在                             |
| error2 | 密碼錯誤                               |
| 0      | {message:"登入成功",token:tokenstring} |

### 獲取用戶資訊

|             說明              | Method |      Path       |
| :---------------------------: | :----: | :-------------: |
| 解析token獲取user information |  get   | /my/getuserinfo |

##### Parameters

Header

```js
{
	Authorization:Bearer  + token,
}
```



##### Response

| code     | Description                                                  |
| -------- | ------------------------------------------------------------ |
| error    | Sql error                                                    |
| error    | Error/查無此人                                               |
| status:0 | {userid:"T00001",username:"Yen",userident:"MIS",userunit:"IT",unitid:"9"} |

### 用戶權限

|           說明           | Method |     Path      |
| :----------------------: | :----: | :-----------: |
| 確認user是否有管理者權限 |  get   | /my/whoareyou |

##### Parameters

Header

```js
{
	Authorization:Bearer  + token,
}
```



##### Response

| Status | Message  |
| ------ | -------- |
| 0      | 有權限   |
| 1      | 沒有權限 |

### 取得禮品資訊

|                     說明                      | Method |     Path     |
| :-------------------------------------------: | :----: | :----------: |
| 取得現有禮品資訊，放入searchindex可以用於搜尋 |  Get   | /my/giftinfo |

##### Parameters

Header

```js
{
	Authorization:Bearer  + token,
	searchindex:string
}
```

Example

```js
{
	Authorization:Bearer  + token,
	searchindex:EncodeURL("酒"),
}
```



- searchindex需先經過EncodeURL編碼。

##### Response

| Code   | Message                      | Data                                                         |
| ------ | ---------------------------- | ------------------------------------------------------------ |
| Error2 | SQL查詢失敗                  |                                                              |
| 1      | 查無資料                     | ""                                                           |
| 0      | ${username} 載入禮品訊息成功 | {  <br/> giftid: 'AT800070083',<br/> giftname: 'USB掛扣手持雙扇風扇',<br/> giftprice: 409,<br/> giftclass: 'A',<br/> remark: '110年5月購入',<br/> state: '啟用',<br/> ectdate: null<br/>} |

### 停用（刪除）禮品資訊

|    說明    | Method |      Path       |
| :--------: | :----: | :-------------: |
| 將禮品刪除 |  Get   | /my/delgiftinfo |

##### Parameters

Header

```js
{
	Authorization:Bearer  + token,
	colgiftid:string
}
```

Example

```js
{
	Authorization:Bearer  + token,
	colgiftid:'AT800070083'
}
```

##### Response

| Code | Message              |
| ---- | -------------------- |
| 1    | 查無資料/SQL執行失敗 |
| 0    | 刪除成功             |

### 新增禮品資訊

|             說明             | Method |    Path     |
| :--------------------------: | :----: | :---------: |
| 新購禮品時使用，新增禮品主檔 |  Post  | /my/newgift |

##### Parameters

Header

```js
{
	Authorization:Bearer  + token,
	selopt: string //禮品類型 ABCD四型 not null
	ectdate: date //有效日期
	filename: file blob //not null
	giftprice: int //not null
	remark: string //備註
}
```

Example

```javascript
{
	Authorization:Bearer  + token,
	selopt: "B" //禮品類型 ABCD四型 not null
	ectdate: 2022-06-06 //有效日期
	filename: file blob //not null
	giftprice: 1 //not null
	remark: "路口小七買的" //備註
}
```



##### Response

| Status | Message                       |
| ------ | ----------------------------- |
| 0      | "成功新增！"                  |
| 1      | err/SQL執行失敗或照片上傳失敗 |

### 取得禮品庫存

|                      說明                       | Method |      Path      |
| :---------------------------------------------: | :----: | :------------: |
| 取得現有禮品庫存量，放入searchindex可以用於搜尋 |  Get   | /my/giftistock |

##### Parameters

Header

```js
{
	Authorization:Bearer  + token,
	searchindex:string
}
```

Example

```js
{
	Authorization:Bearer  + token,
	searchindex:EncodeURL("酒"),
}
```



- searchindex需先經過EncodeURL編碼。

##### Response

| Code   | Message                      | Data                                                         |
| ------ | ---------------------------- | ------------------------------------------------------------ |
| Error2 | SQL查詢失敗                  |                                                              |
| 1      | 查無資料                     | ""                                                           |
| 0      | ${username} 載入禮品訊息成功 | {<br/>    giftid: 'AT803690027',<br/>    giftname: '路易菲利普卓越360格那希紅葡萄酒',<br/>    giftclass: 'A',<br/>    giftprice: 990,<br/>    stock: 0,<br/>    remark: '',<br/>    state: '啟用',<br/>    ectdate: null<br/> } |

### 更新禮品庫存

|                       說明                       | Method |      Path       |
| :----------------------------------------------: | :----: | :-------------: |
| 對每個禮品進行庫存管理，若成功就進行禮品庫存更新 |  Get   | /my/updatestock |

##### Parameters

Header

```js
{
	Authorization:Bearer  + token,
	selopt:string<!--回傳異動的類型：存入、盤虧、盤盈，須先將這三個字串進行EncodeURL編碼-->
	newvolume:int<!--本次異動數量-->
	giftid:string<!--異動的禮品編號-->
	remark:string<!--該禮品的備註欄位-->
}
```

Example

```javascript
{
	Authorization:Bearer  + token,
	selopt:EncodeURL('盤虧')
	newvolume:1
	giftid:'AT800070083'
	remark:'110年5月購入'
}
```



##### Response

| Status | Message   |
| ------ | --------- |
| 0      | "success" |
| 1      | err       |

### 禮品領用

|                說明                | Method |       Path       |
| :--------------------------------: | :----: | :--------------: |
| 禮品領用，若成功就進行禮品庫存更新 |  Get   | /my/getapplygift |

##### Parameters

Header

```js
{
	Authorization:Bearer  + token,
	selopt:string <!--回傳異動的類型：存入、盤虧、盤盈，須先將這三個字串進行EncodeURL編碼-->
	newvolume:int <!--本次領用數量-->
	giftid:string <!--異動的禮品編號-->
	remark:string <!--領用的事由-->
}
```

Example

```js
{
	Authorization:Bearer  + token,
	newvolume:1
	giftid:'AT800070083'
	remark:'致贈客戶'
}
```



##### Response

| Status | Message   |
| ------ | --------- |
| 0      | "success" |
| 1      | err       |

### 取得待審核禮品資訊

|             說明             | Method |       Path        |
| :--------------------------: | :----: | :---------------: |
| 取得待審核的禮品領用申請資訊 |  Get   | /my/waitforaccpet |

##### Parameters

Header

```javascript
{
	Authorization:Bearer  + token,
}
```



##### Response

| Status | Message   | Data                                                         |
| ------ | --------- | ------------------------------------------------------------ |
| 0      | "Success" | {<br/>    giftid: 'AT803690043',<br/>    username: 'YEN',<br/>    userid: 'T00001',<br/>    volume: 9,<br/>    getdate: null,<br/>    actionclass: '領用',<br/>    getreason: '贈送客戶',<br/>    state: '待審核',<br/>    get_id: 'T00001000532',<br/>    checkdate: null,<br/>    stock: 16,<br/>    giftname: '運維船USB'<br/>  } |
| 1      | err       | ""                                                           |

### 審核禮品

| 說明                                                         | Method |       Path       |
| :----------------------------------------------------------- | :----: | :--------------: |
| 審核禮品的動作，通過就會扣庫存並將該案件狀態設為通過，反之則將狀態設為不通過。 |  Get   | /my/denyoraccpet |

##### Parameters

Header

```javascript
{
	Authorization:Bearer  + token,
  selopt:string, //通過或不通過 須經過EncodeURL編碼
  get_id:string, //領用的案件編號
}
```

Example

```js
{
	Authorization:Bearer  + token,
  selopt:'通過', //通過或不通過 須經過EncodeURL編碼
  get_id:'T00001000532',
}
```



##### Response

| Status | Message     |
| ------ | ----------- |
| 0      | "審核成功"  |
| 1      | SQL執行失敗 |


## 搭配我的前端頁面
[Pages](https://github.com/Yen-An/yensgift)
## MySQL schema
### Table person_info
- giftid varchar(45)
- username varchar(45)
- userpwd varchar(45)
- userident varchar(10)
- userunit varchar(45)
- userid varchar(45)
- unitid varchar(20)
### Table giftinfo
- giftid varchar(45)
- giftname varchar(45)
- giftprice int
- giftclass varchar(4)
- remark varchar(50)
- state varchar(10)
- ectdate date
### Table getgift_rec
- giftid varchar(45)
- username varchar(45)
- userid varchar(45)
- volume int
- getdate date
- actionclass varchar(20)
- getreason varchar(10)
- state varchar(10)
- get_id varchar(45)
- checkdata data
### view

```
CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW giftsys.stocklist AS
	select
	giftsys.gift_info.giftid AS giftid,
	giftsys.gift_info.giftname AS giftname,
	giftsys.gift_info.giftclass AS giftclass,
	giftsys.gift_info.giftprice AS giftprice,
	stockvolume(giftsys.gift_info.giftid) AS stock,
	giftsys.gift_info.remark AS remark,
	giftsys.gift_info.state AS state,
	giftsys.gift_info.ectdate AS ectdate
	from giftsys.gift_info;
``` 
### stock calculate function stockvolume()

```
CREATE  FUNCTION giftsys.stockvolume(giftidtmp varchar(45))
RETURNS INT
BEGIN
	DECLARE perchase int;
	DECLARE shipment int;
	DECLARE a int;
	
	SELECT sum(volume) into perchase
	from giftsys.getgift_rec 
	where (actionclass ='存入' or actionclass='盤盈') 
	AND  giftid=giftidtmp AND state ='通過';
	
	SELECT sum(volume) into shipment
	from giftsys.getgift_rec
	where (actionclass ='領用' or actionclass='盤虧') AND  giftidtmp = giftid AND state ='通過';
	
	
	set a =CASE 
	when shipment is null THEN perchase
	WHEN  perchase='' then  0
	else perchase-shipment
	END;
	RETURN  a;
END;
```

