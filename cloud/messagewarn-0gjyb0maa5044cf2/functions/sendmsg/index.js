const cloud = require('wx-server-sdk')
cloud.init({
  env: 'messagewarn-0gjyb0maa5044cf2' //云环境id
})
exports.main = async (event, context) => {
  var {mobile,msg} = event
  try {
    const result = await cloud.openapi.cloudbase.sendSms({
      env: 'messagewarn-0gjyb0maa5044cf2', //云环境id
      content: msg,
      phoneNumberList: [
        mobile
      ]
    })
    return result
  } catch (err) {
    return err
  }
}