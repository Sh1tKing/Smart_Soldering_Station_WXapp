// pages/management/management.js
var app=getApp();
Page({
  data:{
    Dtempwarn:null,
    Dsmokewarn:null,
    Dsleeptime:null,
    Dloadtemp:null,
    device_name : "CSDN",
    product_id : "YqRZ5hrM6p",
    authInfo : "version=2022-05-01&res=products%2FYqRZ5hrM6p%2Fdevices%2FCSDN&et=2028715245&method=sha1&sign=hRokQQu7H7234O3arME%2F0hpIB2w%3D",
    setUrl: "https://iot-api.heclouds.com/thingmodel/set-device-property"
  },
  tempwarn: function (option){
    var tmp=option.detail.value;
    if(tmp>999) {
      tmp=999;
    }
    if(tmp<200) {
      tmp=200;
    }
    this.setData({
      Dtempwarn:tmp
    })
   // console.log(this.data.Dtempwarn);
  },
  smokewarn: function (option){
    var tmp=option.detail.value;
    if(tmp>100) {
      tmp=100;
    }
    if(tmp<0) {
      tmp=0;
    }
    this.setData({
      Dsmokewarn:tmp
    })
    //console.log(this.data.Dsmokewarn);
  },
  sleeptime: function (option){
    var tmp=option.detail.value;
    if(tmp>60) {
      tmp=60;
    }
    if(tmp<0) {
      tmp=0;
    }
    this.setData({
      Dsleeptime:tmp
    })
    //console.log(this.data.Dsleeptime);
  },
  loadtemp: function (option){
    var tmp=option.detail.value;
    if(tmp>600) {
      tmp=600;
    }
    if(tmp<200) {
      tmp=200;
    }
    this.setData({
      Dloadtemp:tmp
    })
   // console.log(this.data.Dloadtemp);
  },
  //button function
  tempsetb:function(){
    var Dtempwarn=1000+parseInt(this.data.Dtempwarn);
    app.global_temp=parseInt(this.data.Dtempwarn);
    app.global_tempcheck=1;
    this.setOnenetData(Dtempwarn);
    console.log(Dtempwarn);
  },
  smokesetb:function(){
    var Dsmokewarn=2000+parseInt(this.data.Dsmokewarn);
    app.global_smoke=parseInt(this.data.Dsmokewarn);
    app.global_smokecheck=1;
    this.setOnenetData(Dsmokewarn);
    console.log(Dsmokewarn);
  },
  sleepsetb:function(){
    var Dsleeptime=3000+parseInt(this.data.Dsleeptime);
    this.setOnenetData(Dsleeptime);
    console.log(Dsleeptime);
  },
  loadTsetb:function(){
    var Dloadtemp=4000+parseInt(this.data.Dloadtemp);
    this.setOnenetData(Dloadtemp);
    console.log(Dloadtemp);
  },
  allsetb:function(){
    /*
      温度警报 1(200~999)
      烟雾浓度 2(000~100)
      进入睡眠 3(000~060)
      加载温度 4(200~600)
    */
    var Dtempwarn=1000+parseInt(this.data.Dtempwarn);
    var Dsmokewarn=2000+parseInt(this.data.Dsmokewarn);
    var Dsleeptime=3000+parseInt(this.data.Dsleeptime);
    var Dloadtemp=4000+parseInt(this.data.Dloadtemp);
    app.global_temp=parseInt(this.data.Dtempwarn);
    app.global_smoke=parseInt(this.data.Dsmokewarn);
    app.global_tempcheck=1;
    app.global_smokecheck=1;
    this.setOnenetData(Dtempwarn);
    this.setOnenetData(Dsmokewarn);
    this.setOnenetData(Dsleeptime);
    this.setOnenetData(Dloadtemp);
    console.log(Dtempwarn);
    console.log(Dsmokewarn);
    console.log(Dsleeptime);
    console.log(Dloadtemp);
  },setOnenetData(ledValue) {
    // 以下数据和URL应根据实际情况进行修改
    const authInfo = this.data.authInfo;
    const url = this.data.setUrl;
    const product_id = this.data.product_id;
    const device_name = this.data.device_name;
    // 替换为用户的实际鉴权信息
    wx.request({
      url: url,
      method: 'POST',
      header: {
        'Authorization': authInfo,
      },
      data: {
        "product_id": product_id,
        "device_name":device_name,
        "params": {
          "command": ledValue // 使用传入的ledValue
      },
      success: (res) =>{
        console.log("设备状态信息");
        console.log('完整响应：', res); // 打印完整响应  
        console.log('成功接收数据：', res.data); // 打印接收到的数据 
        //console.log('成功接收数据：', res.data); // 打印接收到的数据
      },
      fail: (err) => {
        console.log("设备状态信息请求失败");
        console.log('请求失败：', err); // 打印错误信息
      }
    } 
    });
  }
})
