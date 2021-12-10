const dbAdapter = require('../adapters/db_adapter')
const storageAdapter = require('../adapters/files_local_adapter')

// params: filename String
// returns: Object {writeStream, data: Object {key, filename, writeStream}}
const setFile = (fileName) => {
  return storageAdapter.set(fileName)
}

// params: filename Object {path, key, filename, mime}
// returns: readStream
const getFile = (data) => {
  return storageAdapter.get(data)
}

// params: Object {path, key, filename}
// returns: Object { mime, size, key, name}
const getFileInfo = async (data) => {
  const info = await storageAdapter.getMimeTypeAndSize(data)
  data.mime = info.mime
  data.size = info.size
  return data
}

// params: Any Object
// returns: id
const saveFileData = async (data) => {
  return await dbAdapter.insertFilesData(data)
}

// params: name
// returns: Object {mime, name, size, id}
const getFileDataByName = (name) => {
  return dbAdapter.getDataByName(name)
}

module.exports = {
  setFile,
  getFile,
  saveFileData,
  getFileInfo,
  getFileDataByName
}
