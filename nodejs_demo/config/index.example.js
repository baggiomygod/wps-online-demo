// 
const path = require('path')
// app_key = bbf0edbe04c74bfc9bf4d669f9fccaf0
const config = {
  WPS: {
    DOMAIN: "https://wwo.wps.cn",
    APP_ID: "xxx",// app_id
    APP_SECRET: "xxx", // WPS开放平台secret_key
    DOWNLOAD_URL: 'http://www.xxx.com' // 开发中用内网穿透工具 映射一个外网可访问的地址
  },
  YOUR_SECRET_STRING: 'exampleXXX',
  PORT: '19999',
  FILE_DIR: path.join(__dirname, '../../dir'),
  VIEW_DIR: path.join(__dirname, '../../app')
}

module.exports =  config
