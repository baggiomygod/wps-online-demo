const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

const config = global.gConfig
const { sign } = require('../util')

const TokenExpiresTime = 600 * 1000


function getCreateFileUrlAndToken(req, res, next) {
  const fileType = req.query['_w_filetype']
  if (fileType) {
    let wpsUrl = getWpsUrl(fileType)
    let lastTokenTime = req.app.locals.lastTokenTime
    console.log('----------------lastTokenTime----------------', lastTokenTime)
    let tokens = req.app.locals.tokens
    if (!(lastTokenTime &&
      tokens &&
      Date.now() - lastTokenTime > 0)) {
        tokens = tokens = jwt.sign({
          exp: TokenExpiresTime,
          data: uuidv4()
        }, config.YOUR_SECRET_STRING)
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

function getWpsUrl(fileType) {
  const appId = config.WPS.APP_ID
  const hasToken = '1'
  
  let signValues = `_w_appid=${appId}&_w_tokentype=${hasToken}`
                    .split('&')
                    .sort((a, b) => a.split('=')[0].localeCompare(b.split('=')[0]))
  let hash = sign(signValues, config.WPS.APP_SECRET)
  return `${config.WPS.DOMAIN}/office/${fileType}/new/0?${encodeURI(signValues.join('&'))}&_w_signature=${encodeURIComponent(hash)}`
}



module.exports = {
  getCreateFileUrlAndToken
}
