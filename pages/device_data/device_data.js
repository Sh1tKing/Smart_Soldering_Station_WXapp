var utils=require('../../utils/util')
import * as echarts from '../../components/ec-canvas/echarts'
// pages/device_data/device_data.js
var mytime=new Date();
const hours = String(mytime.getHours()).padStart(2, '0');
const minutes = String(mytime.getMinutes()).padStart(2, '0');
const seconds = String(mytime.getSeconds()).padStart(2, '0');
var temperature=[];
var humi=[];
var light=[];
var time=[];
var fanV=[];
var smoke=[];
var monthday=[];
var spending=[];
var timedata=[];
var bartimedata=[];
var lastdatalength=0;
const barAlldata = new Map();

for(var i=0;i<15;i++){
  time.push(hours+'.'+minutes+'.'+seconds);
}
const colors=['#3f72af','#e84545'];
function line_set(chart, xdata, tempdata,smokedata) {
  
  var option = {
    color:colors,
    title: {
      text: '时间变化图',
      left: '165rpx',
      top:'4%',
      textStyle: {
        color: "black",
        fontSize:15,
      }
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      formatter: (params) => {
        var relVal = '时间：'+ params[0].name;
        var dw=['℃','ppm'];
        for (var i = 0, l = params.length; i < l; i++) {
          relVal += '\n' + params[i].seriesName + ' ' + params[i].marker + ' ' + params[i].data+dw[i];
        }
        return relVal;
      }
    }, 
    axisPointer: {
      animation: false
    },
    xAxis: {
      splitLine: {
        show: false
      },
      axisLabel: {  
        color: 'black',
        interval:0,  
        rotate:40  
     } ,
      type: 'category',
      boundaryGap: false,
      data: xdata,
      // show: false
    },
    stateAnimation:{
      duration : 300,
      easing:"cubicOut"
    },
     animation: "false",
    // animationDuration: 1000,
    // animationDurationUpdate: 500,
    // animationEasing: "cubicInOut",
    // animationEasingUpdate: "cubicInOut",
    // animationThreshold: 2000,
    // progressiveThreshold: 3000,
    // progressive: 400,
    // hoverLayerThreshold: 3000,
    // useUTC: false,
    yAxis: [
        {//温度
          
          name:'温度/℃',
          x: 'center',
          position:'left',
          type: 'value',
          splitNumber:8,//y轴温度个数
          min: 0,
          max: 800,
          splitLine: {
            show: true,
            lineStyle:{
              type:'dashed',
              color:'#b0b3b3'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: colors[1]
            }
          },
          axisLabel:{
            show:true,
            showMaxLabel:true,
            showMinLabel:true
          }
        },
        {//烟雾浓度
          name:'烟雾浓度 mg/m³',
          position:'right',
          type: 'value',
          splitNumber:8,//y轴温度个数
          min: 0,
          max: 200,
          splitLine: {
            show: false
          },axisLine: {
            show: true,
            lineStyle: {
              color: colors[0]
            }
          },
          axisLabel:{
            show:true,
            showMaxLabel:true,
            showMinLabel:true
          }
        }
  ],
    grid: {
      top: "20%",
      right:"20%",
      containLabel: true
    },
    series: [{
      name: '温度',
      type: 'line',
      smooth: true,
      data: tempdata,
      color: colors[1]
    },{
      name: '烟雾浓度',
      type: 'line',
      smooth: true,
      data: smokedata,
      yAxisIndex: 1,
      color: colors[0]
    }],
    animationDuration: 100,
    animationEasing:'cubicInOut'
  };
  
  chart.setOption(option);
}
function bar_set(chart,xdata,usingtime,isonline){
  var option = {
    dataZoom : [
      {
        type: 'slider',
        show: true,
        start: 0,
        end: 500,
        xAxisIndex: [0],
      },{
        type: 'inside',
        show: true,
        start: 0,
        end: 500,
        xAxisIndex: [0],
      },
    ],
    title:{
      text:"过去使用记录", 
      top:'25rpx',
      left:'120rpx',
      textStyle: {
        color: "black",
        fontSize:15,
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params) => {
        var relVal = '日期：'+ params[0].name
        for (var i = 0, l = params.length; i < l; i++) {
          var hour=parseInt(params[i].value);
          var min=parseInt((params[i].value-hour)*60);
          var second=parseInt(params[i].value*3600-hour*3600-min*60);
          relVal += '\n' + '使用时长：' + ' ' + params[i].marker + ' ' + hour+'h'+min+'m'+second+'s';
        }
        return relVal;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        
        type: 'category',
        data: xdata,
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        name:"使用时长(h)",
        min:0,
        max: 12,
        type: 'value'
      }
    ],
    series: [
      {
        
        name: 'Direct',
        type: 'bar',
        barWidth: '60%',
        data: usingtime,
        label: {
          show: true, 
          position: 'top', 
          formatter: '{c}h',
          textStyle: { 
              color: 'black',
              fontSize: 8
          }
        }
      }
    ]
  };
  chart.setOption(option);
}
Page({
  data: {
    ec:{
      lazyLoad: true
    },
    onlinecheck: 0,
    device_name : "CSDN",
    product_id : "YqRZ5hrM6p",
    start_time : app.global_start,
    end_time : app.global_end,
    authInfo : "version=2022-05-01&res=products%2FYqRZ5hrM6p%2Fdevices%2FCSDN&et=2028715245&method=sha1&sign=hRokQQu7H7234O3arME%2F0hpIB2w%3D",
    setUrl: "https://iot-api.heclouds.com/thingmodel/set-device-property",  
    deviceStatusUrl: " ",  //在下方更改
    getDataUrl: " ",
    oneNETData:[],
    deviceStatus: [],
    timer:''
  },
  onLoad(options) {
// 生命周期函数--监听页面加载  
    // 构建deviceStatusUrl  
    let deviceStatusUrl = `https://iot-api.heclouds.com/device/status-history?product_id=${this.data.product_id}&device_name=${this.data.device_name}&start_time=${this.data.start_time}&end_time=${this.data.end_time}&limit=100`;  
      
    // 构建getDataUrl  
    let getDataUrl = `https://iot-api.heclouds.com/thingmodel/query-device-property?product_id=${this.data.product_id}&device_name=${this.data.device_name}`;  
      var that =this;
    // 打印或使用这些URL  
    console.log('deviceStatusUrl:', deviceStatusUrl);  
    console.log('getDataUrl:', getDataUrl);  
    this.setData({  
      deviceStatusUrl: deviceStatusUrl,  
      getDataUrl: getDataUrl  
    });  
    // 如果需要将构建的URL保存到data中以便后续使用  
    that.getOption();
    this.setData({  
        timer: setInterval(function () {
          if(that.data.onlinecheck == 1) {
            that.getOption();
            //console.log(that.data.onlinecheck);
          }
      }, 1500)
    });  
    // this.fetchOnenetData();
    // this.fetchDeviceStatus();
    // this.setOnenetData(13245);
  },
  onReady: function () {
    this.oneComponent = this.selectComponent('#mychart-ts');
    this.oneComponent2=this.selectComponent('#mychart-history');
  },
  init_chart: function (xdata, tempdata,smokedata) {           //初始化第一个图表
    this.oneComponent.init((canvas, width, height, dpr) => {
        const chart = echarts.init(canvas, null, {
            width: width,
            height: height,
            devicePixelRatio: dpr 
        });
        line_set(chart, xdata, tempdata,smokedata)
        this.chart = chart;
        return chart;
    });
  },
  init_chart2:function(xdata,usingtime){
    this.oneComponent2.init((canvas, width, height, dpr) => {
      const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr 
      });
      bar_set(chart, xdata, usingtime)
      this.chart = chart;
      return chart;
    });
  },
  getOption:function () {
    this.fetchOnenetData();
    this.fetchDeviceStatus();
  },
  // 获取mqtt设备最新属性值
  fetchOnenetData() {
    // 这里应替换为用户的实际鉴权信息
    const authInfo = this.data.authInfo;
    // 构建请求的 URL 
    const url = this.data.getDataUrl;
    wx.request({
      url: url,
      method: "GET",
      data:{
        limit:15
      },
      header: {
        'Authorization': authInfo
      },
      success: (res) => {
        // 更新设备属性值数据
        this.setData({
          onenetData: res.data
        });
          var mytime=new Date();
          const hours = String(mytime.getHours()).padStart(2, '0');
          const minutes = String(mytime.getMinutes()).padStart(2, '0');
          const seconds = String(mytime.getSeconds()).padStart(2, '0');
          //for(var i = 0; i < 5; i++) {
          //var v1=(Math.random()*(800-0)+0).toFixed(1);
          //var v2=(Math.random()*(200-0)+0).toFixed(1);
         
            if(temperature.length==16){//x轴个数
                temperature.shift();
                smoke.shift();
            }
            if(time.length==16){//x轴个数
              time.shift();
          }
            temperature.push(res.data.data[3].value);
            smoke.push(res.data.data[2].value);
            time.push(hours+'.'+minutes+'.'+seconds);
            timer: setInterval(function () {
            }, 1000)
        this.init_chart(time,temperature,smoke);
       
      //  console.log("OneNET数据获取成功：", temperature); 
      },
      fail: (err) => {
        console.log("OneNET数据请求失败");
        console.error(err); // 处理请求失败的情况
      }
    });
    
  },
  // 获取设备状态历史信息
  fetchDeviceStatus() {
    // 这里应替换为用户的实际鉴权信息
    const authInfo = this.data.authInfo; 
    const url = this.data.deviceStatusUrl;
    var that = this;
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
          timedata: res.data.data.list,
          onlinecheck: res.data.data.list[0].status //有数据
          //onlinecheck:1//无数据
        }); 
        console.log(res.data);
        var l=res.data.data.list.length;
        var begin=-1;
        var end=-1;
        if(l>lastdatalength){
          for(var i=l-lastdatalength-1;i>=0;i--){
            var tmp=res.data.data.list[i].status;
              if(tmp==1 && begin==-1){
                begin=i;
              }
              if(tmp==0){
                end=i;
              }
              if(begin!=-1 && end!=-1){
                var s=res.data.data.list[end].time-res.data.data.list[begin].time;
                var hours = parseInt((s % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = parseInt((s % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = ((s % (1000 * 60)) / 1000).toFixed(0);
                let t=new Date(res.data.data.list[begin].time);
                var month=t.getMonth()+1;
                var day=t.getDate();
                var bartime=(hours+(minutes/60)+(seconds/3600)).toFixed(2);
                if(bartime==0) continue;
                var previous=Number(0);
                if(barAlldata.get(month+'-'+day)!=undefined)
                  previous=Number(barAlldata.get(month+'-'+day));
                var p=Number(previous+Number(bartime)).toFixed(2);
                barAlldata.set(month+'-'+day,p);
                spending.push(hours+'h'+minutes+'min'+seconds+'s'); 
                if(barAlldata.size>30){
                  var t1=barAlldata.keys().next().value;

                  barAlldata.delete(t1);
                  spending.shift();
                }
                begin=-1,end=-1;
              }
          }
          barAlldata.forEach(function(value,key){
            bartimedata.push(value);
            monthday.push(key);
          })
          // wx.setStorage({
          //   key: 'userInfo',
          //   data: { bartimedataLOCAL:bartimedata, monthdayLOCAL:monthday},
          //   success: function () {
          //     console.log('设置缓存数据成功');
          //   }
          // });
          //console.log(monthday);
          lastdatalength=l;
          this.init_chart2(monthday,bartimedata);
        }
        // console.log(monthday);
        // console.log(spending);
        // console.log(bartimedata);
        // console.log(this.data.onlinecheck);
         // 打印获取到的设备属性值数据  
        // console.log(res.data.data.list);
      },
      fail: (err) => {
        console.log("设备状态信息请求失败");
        console.error(err); // 处理请求失败的情况
      }
    });
  }
})
/*
  风扇:100(000)
  led:200(000)
  温度警报 300(000)
  烟雾浓度 400(000)
  进入睡眠 500(000)
  加载温度 600(000)
*/
