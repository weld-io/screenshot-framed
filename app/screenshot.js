//
// Name:    page.js
// Purpose: Controller and routing for full page text
// Creator: Tom Söderlund
//

const fs = require('fs')

const getHTML = ({property}) => `<!DOCTYPE html> 
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

main img {
  position: absolute;
  width: 1280px;
  height: 823px; /* 0.6428 */
  z-index: 2;
}

main iframe {
  position: absolute;
  width: 1234px;
  height: 693px;
  left: 23px;
  top: 107px;
  z-index: 1;
}

</style>
</head>
<body>

<main id="content">
  <img src="/public/weld_browser@2x.png" alt="Browser" />
  <iframe src="https://www.dn.se/" frameborder="0" />
</main>

</body>
</html>`

const serveScreenshot = function (req, res) {
  res.setHeader('Content-Type', 'text/html')
  res.end(getHTML({}))
}

const servePublic = function (req, res) {
  const filePath = `./app${req.url}`
  res.writeHead(200, {'Content-Type': 'image/png'})
  fs.createReadStream(filePath).pipe(res)
}

const serve404 = function (req, res) {
  res.setHeader({'Content-Type': 'text/html'})
  res.end('Not found')
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
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/html')
    res.end(JSON.stringify({ code: res.statusCode, message: err.message }))
    console.error(err.message)
  }
}

module.exports = router
