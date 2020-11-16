var express = require('express');
var router = express.Router();
const { mockFileInfo, mockUserInfo, mockCpUsers } = require('../../controller/mockService')

router.get('/fileInfo', mockFileInfo)

router.get('/userInfo', mockUserInfo)

router.get('/cpUsers', mockCpUsers)

module.exports = router;
