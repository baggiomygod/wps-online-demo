
const XFileID = "x-weboffice-file-id"
const	XUserToken = "x-wps-weboffice-token"

const validateMiddleware = (req, res, next) => {

  let isCorrectSignature = checkOpenSignature()
  if (!isCorrectSignature) {
    return next(new Error('InvalidSignature'))
  }
  let tokenErrMsg = checkToken()
  if (tokenErrMsg) {
    return next(new Error(tokenErrMsg))
  }
  let fileIdErrMsg = checkFileId()
  if (fileIdErrMsg) {
    return next(new Error(fileIdErrMsg))
  }
  let isCorrectUserAgent = checkUserAgent()
  if (!isCorrectUserAgent) {
    return next(new Error('InvalidUserAgent'))
  }
  let isCorrectAppId = checkAppId()
  if (!isCorrectAppId) {
    return next(new Error('InvalidAppId'))
  }
  next()

  function checkOpenSignature() {
    return true
  }

  function checkToken() {
    let tokens = req.app.locals.tokens
    let lastTokenTime = req.app.locals.lastTokenTime
    let errMsg = ''
    if (!req.headers[XUserToken] || tokens !== req.headers[XUserToken]) {
      console.debug('---------------------------req.headers--------------------', req.headers)
      console.debug('---------------------------tokens-----------------------', tokens)
      errMsg = 'invalid access_token'
    }
    if (lastTokenTime - Date.now() < 0) {
      console.debug('lastTokenTime', lastTokenTime)
      errMsg = 'token Time Out'
    }
    return errMsg
  }

  function checkFileId() {
    let fileId = req.headers[XFileID]
    let errMsg = ''
    if (!fileId) {
      errMsg = 'param fileId not exist'
    }
    // if (!req.app.locals.fileIdMap[fileId]) {
    //   errMsg = 'fileId not exist'
    // }
    req.fileId = fileId
    return errMsg
  }

  function checkUserAgent() {
    return true
  }

  function checkAppId() {
    return true
  }
}

module.exports = {
  validateMiddleware
}