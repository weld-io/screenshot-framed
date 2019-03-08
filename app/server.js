// Just a test server for development, not used by Now hosting
const { createServer } = require('http')
const PORT = process.env.PORT || 3037
const controller = 'screenshot'
createServer(require(`./${controller}`)).listen(PORT, () => console.log(`screenshot-framed running on http://localhost:${PORT}, NODE_ENV: ${process.env.NODE_ENV}`))
