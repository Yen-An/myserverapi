# 含有CURD及登入驗證功能之Express Api
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
`
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
from
    giftsys.gift_info;
### stock calculate function stockvolume()
`CREATE  FUNCTION giftsys.stockvolume(giftidtmp varchar(45))
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
`
