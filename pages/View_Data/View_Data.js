var app=getApp();
Page({
    data: {
      onlinecheck:0,
      temperature:0, //温度
      light:0,//亮度
      fanV:0,//转速
      smoke:0,//烟雾浓度
      sendfanv:0,
      sendled:0,
      sliderLEDValue: 0, // 滑块的当前值
      sliderLEDPercent: '0%', // 滑块的百分值显示
      sliderFANValue: 0, // 风扇的当前值
      sliderFANPercent: '0%', // 风扇的百分值显示
      sliderLTValue:200,
      device_name : "CSDN",
      product_id : "YqRZ5hrM6p",
      start_time : "1714690223000",
      end_time : "1717235023000",
      authInfo : "version=2022-05-01&res=products%2FYqRZ5hrM6p%2Fdevices%2FCSDN&et=2028715245&method=sha1&sign=hRokQQu7H7234O3arME%2F0hpIB2w%3D",
      setUrl: "https://iot-api.heclouds.com/thingmodel/set-device-property",  
      deviceStatusUrl: " ",  //在下方更改
      getDataUrl: " ",
      oneNETData:[],
      deviceStatus: [],
      timer:''
    },
    fetchOnenetData() {
      let getDataUrl = `https://iot-api.heclouds.com/thingmodel/query-device-property?product_id=${this.data.product_id}&device_name=${this.data.device_name}`;  
      // 这里应替换为用户的实际鉴权信息
      const authInfo = this.data.authInfo;
      // 构建请求的 URL 
      const url = getDataUrl;
      wx.request({
        url: url,
        method: "GET",
        header: {
          'Authorization': authInfo
        },
        success: (res) => {
          if(this.data.onlinecheck==1){
            this.setData({//获取数据 
              light:res.data.data[0].value,
              smoke:res.data.data[2].value,
              temperature: res.data.data[3].value,
              fanV:res.data.data[4].value
            });
          }
           // 打印获取到的设备属性值数据  
          //console.log("OneNET数据获取成功：",  res.data); 
        },
        fail: (err) => {
          console.log("OneNET数据请求失败");
          console.error(err); // 处理请求失败的情况
        }
      });
    },
    fetchDeviceStatus() {
      // 这里应替换为用户的实际鉴权信息
      let deviceStatusUrl = `https://iot-api.heclouds.com/device/status-history?product_id=${this.data.product_id}&device_name=${this.data.device_name}&start_time=${this.data.start_time}&end_time=${this.data.end_time}&limit=100`;  
      const authInfo = this.data.authInfo; 
      const url = deviceStatusUrl;
      wx.request({
        url: url,
        method: "GET",
        header: {
          'Authorization': authInfo
        },
        success: (res) => {
          // 更新设备状态信息数据
          this.setData({
            deviceStatus: res.data,
            //onlinecheck:res.data.data.list[0].status//有数据
            //onlinecheck:1//无数据
          });
           // 打印获取到的设备属性值数据  
           //console.log(res.data.data.list[0].status);
           console.log("OneNET数据获取成功：",  res.data); 
        },
        fail: (err) => {
          console.log("设备状态信息请求失败");
          console.error(err); // 处理请求失败的情况
        }
      });
    },
    onLoad() {
      var that = this;
          timer:setInterval(function(){
            if(that.data.temperature>app.global_temp && app.global_tempcheck==1){
              app.global_tempcheck=0;
              wx.showModal({
                title: '警告',
                content: '烙铁温度已超过设定温度',
                success: function (res) {
                }
              })
            }
            if(that.data.smoke>app.global_smoke && app.global_smokecheck==1){
              app.global_smokecheck=0;
              wx.showModal({
                title: '警告',
                content: '烟雾浓度已超过设定范围',
                success: function (res) {
                }
              })
            }
           that.fetchOnenetData(),
           that.fetchDeviceStatus()
          },500);
    },
    sliderSetFAN: function(e) {
      var value = Number(e.detail.value)+6000;
      this.setOnenetData(value);
      console.log(value);
    },
    sliderSetLED: function(e) {
      var value = Number(e.detail.value)+7000;
      this.setOnenetData(value);
      console.log(value);
    },
    sliderSetLT:function(e){
      var value = Number(e.detail.value)+5000;
      this.setOnenetData(value);
      console.log(value);
    },
    sliderChangeLED: function(e) {
      var value = e.detail.value;
      //console.log(value);
      var percent = value + '%'; // 计算百分值
      this.setData({
        sliderLEDValue: value,
        sliderLEDPercent: percent
      });
    },
    sliderChangeFAN: function(e) {
      var value = e.detail.value;
      //console.log(value);
      var percent = value + '%'; // 计算百分值
      this.setData({
        sliderFANValue: value,
        sliderFANPercent: percent
      });
    },
    sliderChangeLT:function(e){
      var value =e.detail.value;
      this.setData({
        sliderLTValue:value
      });
    },
  setOnenetData(ledValue) {
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
        console.log('成功接收数据：', res.data); // 打印接收到的数据
      },
      fail: (err) => {
        console.log("设备状态信息请求失败");
        console.log('请求失败：', err); // 打印错误信息
      }
    } 
    });
  }
})
