const express = require('express')
const app = express()

const start = (storage) => {
  app.put('/files/:filename', function (req, res) {
    const link = storage.setFile(req.params.filename)
    req.pipe(link.stream)
    req.on('end', () => {
      setTimeout(() => {
        storage.getFileInfo(link).then(data => {
          storage.saveFileData(data).then(id => {
            data.id = id
            data.stream = undefined
            res.setHeader('Content-type', 'application/json')
            res.send(JSON.stringify({
              data,
              status: 'success'
            }))
          })
        })
      }, 1000)
    })
  })

  app.get('/files/:filename', function (req, res) {
    try {
      storage.getFileDataByName(req.params.filename).then(data => {
        if (data) {
          const readStream = storage.getFile(data)
          res.setHeader('Content-type', data.mime)
          readStream.pipe(res)
        }
      }).catch(e => {
        res.sendStatus(404)
      })
    } catch (e) {
      res.sendStatus(500)
      console.error(e)
    }
  })

  app.use(function (req, res, next) {
    res.status(404)
    res.send('404: Route Not Found')
  })
  app.listen(8080, function () {
    console.log('app listening on port 8080!')
  })
}

module.exports = {
  start
}
