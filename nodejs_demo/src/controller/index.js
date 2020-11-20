const { getListFileHandler } = require('./getListFile')
const { getUrlAndTokenHandler } = require('./getUrlAndToken')
const { getCreateFileUrlAndToken } = require('./getCreateFileUrlAndToken')
const { getReplaceTextsHandler } = require('./getReplaceTextsHandler')
  

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
 } = require('./file')

module.exports = {
  getListFileHandler,
  getReplaceTextsHandler,
  getUrlAndTokenHandler,
  getFileInfo,
  postFileOnline,
  downloadFile,
  postFile,
  getFileInfoByVersion,
  changeFileName,
  getFileHistoryVersions,
  postNewFile,
  getUserBatch,
  getCreateFileUrlAndToken,
  postNotification
}
