const { getListFileHandler } = require('./getListFile')
const { getUrlAndTokenHandler } = require('./getUrlAndToken')
const { getCreateFileUrlAndToken } = require('./getCreateFileUrlAndToken')
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
