

# wpsweb-demo运行说明(当前版本1.0.3)
***1.设置配置文件config/index.js***
>	port:     demo服务端口(如: "19999")
>
>	DOMAIN:   金山文档在线编辑域名(不需要修改)
>
>	APP_ID:    开发信息中的APPID
>	
>	APP_SECRET:   开发信息中的APPKEY
>	
>	DOWNLOAD_URL: 文件下载地址.即下载接口/demo/file/download的地址.(需要外网能够访问,如: "http://www.xxx.com:19999")
>	
>	FILE_DIR: 文件路径位置,与_w_filename或者_w_fname可拼接成完整的文件路径
>   
>   YOUR_SECRET_STRING: 用来加密token的key
>   
>   VIEW_DIR: 视图位置

***2.终端运行demo命令:***
>   安装node, node版本>=8
>
>	cd wpsweb-demo/nodejs_demo
>   config/index.example.js 填写配置并改为index.js
>	npm install
>
>	npm run start

***3.数据回调URL:***
>	确认填写的回调URL能通过外网正常访问到demo接口(回调URL需在申请页面中设置)
>
>   如: http://www.xxx.com:19999


***4.打开浏览器输入地址:***
>	demo服务地址
>
>   如: www.xxx.com:19999
