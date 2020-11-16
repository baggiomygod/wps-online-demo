const router = require('express').Router();
const path = require('path')

const fileRouter = require('./file')
const mockRouter = require('./mock')
const multer  = require('multer')

const upload = multer()
const { getListFileHandler, getUrlAndTokenHandler, downloadFile, getCreateFileUrlAndToken } = require('../controller')
const { asyncMiddleware } = require('../util')
const { validateMiddleware } = require('../middleware')

/* GET home page. */
router.get('/', asyncMiddleware(function(req, res, next) {
  //前端获取dir文件夹下的文件名,仅供参考,开发者可以按照本身需求重新定义
  res.sendFile(path.join(global.gConfig.VIEW_DIR, 'index.html'));
}));

/* GET file view page. */
router.get('/view.html', function(req, res, next) {
  res.sendFile(path.join(global.gConfig.VIEW_DIR, 'view.html'));
});


router.get("/getListFile", getListFileHandler)

// test
router.post('/test', upload.array(), (req, res) => {
  console.debug(global.gColor.blue, '------------------test--------------------', req.body)
  res.json(req.body)
})


// 下载文件
router.get('/demo/file/download', downloadFile)

//传入文件名,返回有效的url和token,仅供参考,开发者可以按照本身需求重新定义
router.get("/getUrlAndToken", getUrlAndTokenHandler)

// 获取新建文件的URL和token
router.get("/getCreateFileUrlAndToken", getCreateFileUrlAndToken)

// file
router.use('/v1/3rd', validateMiddleware, fileRouter);

// mock data
router.use('/mockData', mockRouter);


module.exports = router;

