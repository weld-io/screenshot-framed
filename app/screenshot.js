//
// Name:    page.js
// Purpose: Controller and routing for full page text
// Creator: Tom Söderlund
//

const fs = require('fs')

const parseRequestQuery = url => (url.split('?')[1] || '')
  .split('&')
  .reduce((result, propValue) => {
    const key = propValue.split('=')[0]
    if (key) result[key] = propValue.split('=')[1]
    return result
  }, {})

const serveScreenshot = function (req, res) {
  const query = parseRequestQuery(req.url)
  if (!query.url) throw new Error(`No "url" specified: ${req.url}`)
  const pageUrl = decodeURIComponent(query.url)
  res.setHeader('Content-Type', 'text/html')
  res.end(getHTML({ pageUrl }))
}

const servePublic = function (req, res) {
  const filePath = `./app${req.url}`
  res.writeHead(200, { 'Content-Type': 'image/png' })
  fs.createReadStream(filePath).pipe(res)
}

const serve404 = function (req, res) {
  const message = `Not found: ${req.url}`
  res.statusCode = 404
  res.statusMessage = message
  res.end(message)
}

const router = async function (req, res) {
  try {
    console.log(`url`, req.url)
    const { url } = req
    if (url.includes('/screenshot')) {
      serveScreenshot(req, res)
    } else if (url.includes('/public')) {
      servePublic(req, res)
    } else {
      serve404(req, res)
    }
  } catch (err) {
    console.error(err.message)
    res.statusCode = 500
    res.statusMessage = err.message
    res.end(err.message)
  }
}

const getHTML = ({ pageUrl }) => `<!DOCTYPE html> 
<html lang="en-us">
<head>
<meta http-equiv="content-type" content="text/html;charset=UTF-8"/>
<title>Screenshot</title>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
<style type="text/css">

* {
  margin: 0;
  padding: 0;
}

#browser {
  position: absolute;
  width: 1280px;
  height: 823px; /* 0.6428 */
  z-index: 2;
}

#content {
  position: absolute;
  left: 23px;
  top: 106px;
  width: 1234px;
  height: 694px;
  z-index: 1;
}

</style>
</head>
<body>

<main>
  <img id="browser" src="/public/weld_browser@2x.png" alt="Browser" />
  <img id="content" src="https://scraping-service.now.sh/api/image?width=1234&height=694&dpr=1&url=${pageUrl}" alt="Web page" />
</main>

</body>
</html>`

module.exports = router
