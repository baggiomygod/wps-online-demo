const fs = require('fs')
const path = require('path')
const crypto = require('crypto');
const config = global.gConfig

/**
 * 支持的文件格式
 * @param {string} ext 扩展名
 */
function getFileType(fileName) {
  const ext = fileName.split('.')[1]
  if (/et|xls|xlt|xlsx|xlsm|xltx|xltm|csv/i.test(ext)) return 's'
  if (/doc|docx|txt|dot|wps|wpt|dotx|docm|dotm/i.test(ext)) return 'w'
  if (/ppt|pptx|pptm|pptm|ppsm|pps|potx|potm|dpt|dps/i.test(ext)) return 'p'
  if (/pdf/i.test(ext)) return 'f'
}

function readFile(dir) {
  return new Promise((resolve, rejected) => {
    fs.readdir(dir, (error, files) => {
      if (error) {
        rejected(new Error(error))
      }
      files = files.filter(file => {
        const stat = fs.statSync(path.join(dir, file))
        return !stat.isDirectory()
      })
      resolve(files)
    })
  })
}


function writeFile(filePath, fileBuffer) {
  return new Promise((resolve, rejected) => {
    let writeStream = fs.createWriteStream(filePath)
    writeStream.write(fileBuffer)
    writeStream.on('error', (e) => {
      rejected(e)
    })
    writeStream.on('finish', () => {
      resolve('finish')
    })
    writeStream.end()
  })
}

/**
 * 根据http://open-doc.wps.cn/%E9%87%91%E5%B1%B1%E6%96%87%E6%A1%A3%E5%9C%A8%E7%BA%BF%E7%BC%96%E8%BE%91/%E7%AD%BE%E5%90%8D%E7%94%9F%E6%88%90%E8%AF%B4%E6%98%8E.html文档生成
 * @param {array} signValues
 * @param {string} secretKey
 */
function sign(signValues, secretKey) {
  let values = signValues.join('')
  values = `${values}_w_secretkey=${secretKey}`
  // hmac-sha1 加密
  let hash = crypto.createHmac('sha1', secretKey).update(values).digest().toString('base64')
  return hash
}

function generateFileId(fileName) {
  let fileId = crypto.createHash('md5').update(fileName).digest("hex")
  if (fileId.length > 20) {
    fileId = fileId.slice(0, 20)
  }
  return fileId
}

function getFileDirPathOrMkdir(fileName) {
  let [file, ext] = fileName.split('.')
  checkDirectorySync(config.FILE_DIR, file, ext)
  

  function checkDirectorySync(directory, file, ext) {
    let fileDirectory = path.join(directory, file)
    try {
      fs.statSync(fileDirectory)
    } catch(e) {
      fs.mkdirSync(fileDirectory)
      fs.copyFileSync(path.join(directory, file + '.' + ext), path.join(fileDirectory, `1.${ext}`));
    }
  }
}



function handleSameFile() {
  let [file, ext] = fileName.split('.')
  checkDirectorySync(config.FILE_DIR, file, ext)
  

  function checkDirectorySync(directory, file, ext) {
    let fileDirectory = path.join(directory, file)
    fs.mkdirSync(fileDirectory)
    fs.copyFileSync(path.join(directory, file + '.' + ext), path.join(fileDirectory, `1.${ext}`));
  }
}

async function getLatestVersion(fileName) {
  let fileDirectory = path.join(config.FILE_DIR, fileName.split('.')[0])
  let files = await readFile(fileDirectory)
  let versions = files.map(file => file.split('.')[0])
  let latestVersion = Math.max(...versions)
  return latestVersion
}

const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

module.exports = {
  getFileType,
  generateFileId,
  asyncMiddleware,
  getFileDirPathOrMkdir,
  sign,
  readFile,
  writeFile,
  getLatestVersion
}