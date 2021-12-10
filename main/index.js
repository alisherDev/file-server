const apiServer = require('./api')
const storage = require('./storage')

const init = () => {
  apiServer.start(storage)
}

init()
