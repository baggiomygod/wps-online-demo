const fs = require('fs')
const path = require('path')
const { generateFileId, readFile } = require('../util')

function getListFileHandler(req, res, next) {
  req.app.locals.fileIdMap = req.app.locals.fileIdMap || {}
  readFile(global.gConfig.FILE_DIR)
  .then(files => {
    files = files.filter(file => /docx|pptx|xlsx|pdf/i.test(path.extname(file)))
    if (!Object.keys(req.app.locals.fileIdMap).length) {
      files.forEach(file => req.app.locals.fileIdMap[generateFileId(file)] = file)
    }
    let renderFiles = req.app.locals.fileIdMap
    res.json({
      name_files: renderFiles
    })
  })
  .catch(err => {
    next(new Error(err))
  }) 
}



module.exports = {
  getListFileHandler
}
