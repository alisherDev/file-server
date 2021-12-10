const db = require('better-sqlite3')('./db')

db.exec(`
    CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY,
      name TEXT,
      mime TEXT,
      size TEXT,
      key TEXT
    )
`)

// params: Object {mime, name, size, id}
// returns: fileId
const insertFilesData = (data) => {
  const s = db.prepare('INSERT INTO files (name, mime, size, key) VALUES (?, ?, ?, ?)')
  s.run([data.name, data.mime, data.size, data.key])
  return new Promise((resolve, reject) => {
    const row = db.prepare('SELECT * FROM files WHERE name = ? ORDER BY id DESC LIMIT 1').get(data.name)
    resolve(row.id)
  })
}

// params: filename
// returns: Object {mime, name, size, id, key}
const getDataByName = (name) => {
  return new Promise((resolve, reject) => {
    const row = db.prepare('SELECT * FROM files WHERE name = ?ORDER BY id DESC LIMIT 1')
      .get(name)
    if (row) {
      resolve(row)
    } else {
      throw new Error(404)
    }
  })
}

module.exports = {
  insertFilesData,
  getDataByName
}
