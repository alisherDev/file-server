const fs = require('fs')
const mime = require('mime')

const dirname = './saved_files/'

const init = () => {
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname)
  }
}

// params: filename String
// returns: Object {writeStream, data: Object {key, filename, writeStream}}
const set = (name) => {
  const key = (Math.random() + 1).toString(36).substring(2)
  const path = dirname + key + name
  return {
    key,
    stream: fs.createWriteStream(path),
    name
  }
}

// params: filename Object {path, key, filename, mime}
// returns: readStream
const get = (metadata) => {
  const path = dirname + metadata.key + metadata.name
  if (!fs.existsSync(dirname)) {
    throw new Error(404)
  }
  return fs.createReadStream(path)
}

// params: Object { fileName and key }
// returns: Promise(Object {mime, size})
const getMimeTypeAndSize = (metadata) => {
  const path = dirname + metadata.key + metadata.name
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        reject(err)
      } else {
        resolve({
          size: stats.size,
          mime: mime.getType(path)
        })
      }
    })
  })
}

init()

module.exports = {
  set,
  get,
  getMimeTypeAndSize
}
