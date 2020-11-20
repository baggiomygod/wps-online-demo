
function getReplaceTextsHandler(req, res, next) {
    res.json({
        title: '标题' + (Math.random() * 100).toFixed(0),
        name: '名称' + (Math.random() * 100).toFixed(0),
        time: new Date(),
      })
  
}



module.exports = {
    getReplaceTextsHandler
}
