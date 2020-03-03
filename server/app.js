const express = require('express')
const path = require('path')
const fs = require('fs-extra')
const multer = require('multer')
const { execSync } = require('child_process')
const app = express()
const upload = multer({ dest: path.join(__dirname, 'temp') })
const fileDir = path.resolve(__dirname, 'file')

app.use(express.json())

function resWrap (msg, data) {
  return {
    success: !msg,
    msg,
    data
  }
}

function fileCommon (name, res, reverse = false) {
  const file = path.resolve(fileDir, name)
  const exist = fs.pathExistsSync(file)
  if (reverse && exist) {
    res.send(resWrap('文件已存在'))
    return false
  } else if (!exist) {
    res.send(resWrap('文件不存在'))
    return false
  }
  return true
}

app.get('/vant-form/import', (req, res) => {
  const name = req.query.name
  const file = path.resolve(fileDir, name)
  if (fileCommon(name, res)) {
    res.send(resWrap(undefined, fs.readJsonSync(file)))
  }
})

app.get('/vant-form/download', function (req, res) {
  const name = req.query.name
  const file = path.resolve(fileDir, name)
  if (fileCommon(name, res)) {
    if (req.query.download) {
      res.download(file)
    } else {
      res.send(resWrap())
    }
  }
})

app.post('/vant-form/savefile', (req, res) => {
  const force = req.body.force
  const file = path.resolve(fileDir, req.body.name)
  if (force || fileCommon(req.body.name, res, true)) {
    fs.outputJsonSync(file, JSON.parse(req.body.content))
    res.send(resWrap())
  }
})

app.post('/vant-form/upload', upload.single('file'), (req, res) => {
  const tempFile = path.resolve(__dirname, 'temp', req.file.filename)
  const content = JSON.parse(fs.readFileSync(tempFile))
  // 删除文件
  execSync(`rm ${tempFile}`)
  res.send(resWrap(undefined, content))
})

app.listen(3030, function () {
  console.log('vant-form app listening on port 3030!')
})
