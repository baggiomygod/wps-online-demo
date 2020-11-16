const path = require('path')
const fs = require('fs')
const fetch = require('node-fetch')
const util = require('util')

const { getLatestVersion, readFile, getFileDirPathOrMkdir, generateFileId, getFileType, writeFile, sign } = require('../../util')
const config = global.gConfig


async function getFileInfo(req, res, next) {
  const fileRes = await fetch(`http://127.0.0.1:${config.PORT}/mockData/fileInfo`)
  const fileInfo = await fileRes.json()
  const userRes = await fetch(`http://127.0.0.1:${config.PORT}/mockData/userInfo`)
  const userInfo = await userRes.json()
  // TODO: 检查文件地址文件等是否存在等
  let fileId = req.fileId 
  // let fileName = filePath.slice(a.lastIndexOf('/') + 1)
  let fileName = req.app.locals.fileIdMap[fileId]
  let modifyTime = Date.now()
  let downloadUrl = config.WPS.DOWNLOAD_URL + '/demo/file/download?_w_fileid=' + fileId

  let file = {
      id: fileId,
      name: fileName,
      modify_time: modifyTime,
      download_url: downloadUrl
  }
  file = Object.assign({}, file, fileInfo)
  let fileModel = {
      file,
      user: userInfo[0]
  }
  res.json(fileModel)
}

async function downloadFile(req, res, next) {
  let fileId = req.query._w_fileid
  let [fileName, ext] = req.app.locals.fileIdMap[fileId].split('.')
  let version = req.query.version
  if (!version) {
    version = await getLatestVersion(req.app.locals.fileIdMap[fileId])
  }
  let file = path.join(config.FILE_DIR, fileName, `${version}.${ext}`)
  res.download(file)
}


async function getUserBatch(req, res, next) {
  let ids = req.body.ids
  let mapIdUrl = ids.map(id => `user=${id}`).join('&')
  const userRes = await fetch(`http://127.0.0.1:${config.PORT}/mockData/userInfo?${mapIdUrl}`)
  const userInfo = await userRes.json()
  res.json({
    users: userInfo
  })
}

function postFileOnline(req, res, next) {
  const ids = req.body.ids
  console.log(global.gColor.blue, '------------------postFileOnline------------------ids\n', ids)
  
  // const cpUsers = await fetch(`http://127.0.0.1:${config.PORT}/mockData/cpUsers`)
  res.status(200).send()
}

async function postFile(req, res, next) {
  let fileId = req.fileId
  let fileName = req.app.locals.fileIdMap[fileId]
  let latestVersion = await getLatestVersion(fileName)
  let newVersion = latestVersion + 1

  let newFile = req.file.buffer
  let [file, ext] = fileName.split('.')
  let newFileName = `${newVersion}.${ext}`
  // Copy数据
  let newFilePath = path.join(config.FILE_DIR, file, newFileName)
  await writeFile(newFilePath, newFile)

  let fileModel = {
    id: fileId,                      //文件id，字符串长度小于40
    name: newFileName,                //文件名
    version: newVersion,                    //当前版本号，位数小于11
    size: 200,                    //文件大小，单位是b
    download_url: config.WPS.DOWNLOAD_URL + '/demo/file/download?_w_fileid=' + fileId//文件下载地址
  }

  res.json({
    file: fileModel
  })
}

async function getFileInfoByVersion(req, res, next) {
  // TODO: get file id
  let fileId = req.fileId
  let fileName = req.app.locals.fileIdMap[fileId]
  let version = Number(req.params.version)
  const fileRes = await fetch(`http://127.0.0.1:${config.PORT}/mockData/fileInfo`)
  const fileInfo = await fileRes.json()
  let fileModel = Object.assign({}, fileInfo, {
    id: fileId,
    name: fileName,
    version,
    download_url: config.WPS.DOWNLOAD_URL + '/demo/file/download?_w_fileid=' + fileId + '&version=' + version//文件下载地址
  })
  res.json({
    file: fileModel
  })
}

function changeFileName(req, res, next) {
  let fileId = req.fileId
  let fileDir = config.FILE_DIR
  let fileName = req.app.locals.fileIdMap[fileId]
  let newFileName = req.body.name
  let filePath = path.join(fileDir, fileName)
  let newFilePath = path.join(fileDir, newFileName)
  let oldDirectory = path.join(fileDir, fileName.split('.')[0])
  let newDirectory = path.join(fileDir, newFileName.split('.')[0])
  req.app.locals.fileIdMap[fileId] = newFileName
  try {
    fs.renameSync(oldDirectory, newDirectory)
    fs.renameSync(filePath, newFilePath)
  } catch (e) {
    next(e)
  }
  res.status(200).send('')
}

async function postNewFile(req, res, next) {
  const { _w_appid, _w_tokentype } = req.query
  let newFileBuffer = req.file.buffer
  let originalName = req.file.originalname
  let fileType = getFileType(originalName)
  let fileDir = config.FILE_DIR
  // TODO: 处理相同文件
  try {
    await writeFile(path.join(fileDir, originalName), newFileBuffer)
    getFileDirPathOrMkdir(originalName)
    let fileId = generateFileId(originalName)
    req.app.locals.fileIdMap[fileId] = originalName
    const userRes = await fetch(`http://127.0.0.1:${config.PORT}/mockData/userInfo`)
    const userInfo = await userRes.json()
    let signValues = `_w_appid=${_w_appid}&_w_tokentype=${_w_tokentype}&_w_fname=${originalName}&_w_userid=${userInfo.id}`
                    .split('&')
                    .sort((a, b) => a.split('=')[0].localeCompare(b.split('=')[0]))
    let hash = sign(signValues, config.WPS.APP_SECRET)
    // console.debug(`${config.WPS.DOMAIN}/office/${fileType}/${fileId}?${encodeURI(signValues.join('&'))}&_w_signature=${hash}`)
    res.json({
      redirect_url: `${config.WPS.DOMAIN}/office/${fileType}/${fileId}?${encodeURI(signValues.join('&'))}&_w_signature=${encodeURIComponent(hash)}`, //根据此url，可以访问到对应创建的文档
      user_id: userInfo.id  //创建此文档的用户id
    })
  } catch (e) {
    next(e)
  }
}

async function getFileHistoryVersions(req, res, next) {
  let { id: fileId, offset, count } = req.body
  let [fileName, ext] = req.app.locals.fileIdMap[fileId].split('.')
  let fileDirectory = path.join(config.FILE_DIR, fileName)
  let files = await readFile(fileDirectory)
  const fileRes = await fetch(`http://127.0.0.1:${config.PORT}/mockData/fileInfo`)
  const fileInfo = await fileRes.json()
  const userRes = await fetch(`http://127.0.0.1:${config.PORT}/mockData/userInfo`)
  const userInfo = await userRes.json()

  offset = offset || 0
  let sliceCount = offset + count > files.length ? files.length : offset + count
  files.sort((a, b) => a.split('.')[0] - b.split('.')[0])
  historyFiles = files
    .slice(offset, sliceCount)
    .map(file => {
      let version = file.split('.')[0]
      let fileModel = Object.assign({}, fileInfo, {
        id: fileId,
        name: req.app.locals.fileIdMap[fileId],
        version: Number(version),
        modify_time: Date.now(),
        download_url: config.WPS.DOWNLOAD_URL + '/demo/file/download?_w_fileid=' + fileId + '&version=' + version, //文件下载地址
        creator: userInfo[0],
        modifier: userInfo[0]
      })
      return fileModel
  })
  res.json({
    histories: historyFiles
  })
}

function postNotification(req, res, next) {
  let { cmd, body } = req.body
  console.log('postNotification: \n', util.inspect({
    cmd,
    body
  }, {depth: null}))
  res.json({
    "msg":"success"
  })
}


module.exports = {
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
}