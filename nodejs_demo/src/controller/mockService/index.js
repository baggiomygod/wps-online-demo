

function mockUserInfo(req, res, next) {
  let userId = req.query.uid
  let usersInfo
  if (userId) {
    usersInfo = userId.map(id => {
      return {
        id,                //用户id，长度小于40
        name: 'wps' + id,            //用户名称
        permission: 'write',           //用户操作权限，write：可编辑，read：预览
        avatar_url: 'https://ioopsd.cn/img/avatar.jpg'    //用户头像地址
      }
    })
  } else {
    usersInfo = [{
      id: 'user1',                //用户id，长度小于40
      name: 'wps-user1',            //用户名称
      permission: 'write',           //用户操作权限，write：可编辑，read：预览
      avatar_url: 'https://ioopsd.cn/img/avatar.jpg'    //用户头像地址
    }]
  }

  res.json(usersInfo)
}

function mockFileInfo(req, res, next) {
  const fileInfo = {
    size: 1024 * 1024,
    creator: '0',
    modifier: 'user1',
    create_time: 1136185445,
    version: 1,
    user_acl: {
      rename: 1,    //重命名权限，1为打开该权限，0为关闭该权限，默认为0
      history: 1    //历史版本权限，1为打开该权限，0为关闭该权限,默认为1
    }
  }
  res.json(fileInfo)
}

function mockCpUsers(req, res, next) {
  const cpUsers =  {
    ids:["user1"]           //当前协作用户id
  }
  res.json(cpUsers)
}


module.exports = {
  mockFileInfo,
  mockUserInfo,
  mockCpUsers
}