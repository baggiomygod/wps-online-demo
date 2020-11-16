const express = require('express');
const router = express.Router();
const multer  = require('multer')

const upload = multer()
const { asyncMiddleware } = require('../../util')
const { 
  getFileInfo, 
  postFileOnline, 
  downloadFile, 
  postFile, 
  getFileInfoByVersion, 
  changeFileName, 
  getFileHistoryVersions,
  postNewFile,
  getUserBatch,
  postNotification
} = require('../../controller')

//文件下载,仅供参考,开发者可以按照本身需求重新定义
// router.get("/file", downloadFile)

//生成url接口,仅提供参考,本demo未使用
// router.get("/url", getUrlHandler)

//文件上传,仅供参考,开发者可以按照本身需求重新定义
// router.post("/upload", CheckToken, fileUploadHandler)

//获取文件元数据
router.get("/file/info", asyncMiddleware(getFileInfo))

//获取用户信息
router.post("/user/info", asyncMiddleware(getUserBatch))

//上传文件新版本
router.post("/file/save", upload.single('file'), asyncMiddleware(postFile))

//上传在线编辑用户信息
router.post("/file/online", postFileOnline)

//获取特定版本的文件信息
router.get("/file/version/:version", getFileInfoByVersion)

//文件重命名
router.put("/file/rename", changeFileName)

//获取所有历史版本文件信息
router.post("/file/history", getFileHistoryVersions)

//新建文件
router.post("/file/new", upload.single('file'), asyncMiddleware(postNewFile))

// 回调通知
router.post("/onnotify", upload.single('file'), postNotification)

module.exports = router;
