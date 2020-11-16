// const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

const config = global.gConfig
const { getFileType, getFileDirPathOrMkdir, sign } = require('../util')

const TokenExpiresTime = 600 * 1000


function getUrlAndTokenHandler(req, res, next) {
  const fileId = req.query['fileid']
  if (fileId) {
    let wpsUrl = getWpsUrl(fileId, req.app.locals.fileIdMap)
    let fileName = req.app.locals.fileIdMap[fileId]
    getFileDirPathOrMkdir(fileName)
    let lastTokenTime = req.app.locals.lastTokenTime
    console.log('----------------lastTokenTime----------------', lastTokenTime)
    let tokens = req.app.locals.tokens
    if (!(lastTokenTime &&
      tokens &&
      Date.now() - lastTokenTime > 0)) {
        tokens = jwt.sign({
          exp: TokenExpiresTime,
          data: uuidv4()
        }, config.YOUR_SECRET_STRING);
        req.app.locals.tokens = tokens
        req.app.locals.lastTokenTime = Date.now() + TokenExpiresTime
    }
    res.json({
      "token": tokens,
      "expires_in": TokenExpiresTime,
      "wpsUrl" : wpsUrl,
    })
  } else {
    next(new Error('_w_fname not set in url'))
  }
}

function getWpsUrl(fileId, fileIdMap) {
  const fname = fileIdMap[fileId]
  if (!fname) {
    throw new Error('file not exist')
  }
  const fileType = getFileType(fname)
  const appId = config.WPS.APP_ID
  const hasToken = '1'
  
  let signValues = `_w_appid=${appId}&_w_tokentype=${hasToken}`
                    .split('&')
                    .sort((a, b) => a.split('=')[0].localeCompare(b.split('=')[0]))
  let hash = sign(signValues, config.WPS.APP_SECRET)
  return `${config.WPS.DOMAIN}/office/${fileType}/${fileId}?${encodeURI(signValues.join('&'))}&_w_signature=${encodeURIComponent(hash)}`
}



module.exports = {
  getUrlAndTokenHandler
}
