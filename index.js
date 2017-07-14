#!env node
const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const argv = require('minimist')(process.argv.slice(2))

async function startServer () {
  app.use('/root', await rootMiddleware())

  var assets = path.join(__dirname, 'assets')
  if (argv['a']) {
    assets = path.resolve(argv['a'])
  }
  app.use(express.static(assets))

  app.get('/', function (req, res) {
    res.sendFile(path.join(assets, 'playDev.html'))
  })

  app.listen(8388, function () {
    console.log('http://localhost:8388/')
  })
}

function rootMiddleware () {
  const root = argv._[0] || '.'
  // Check if folder exists
  return new Promise((resolve, reject) => {
    const resolvedRoot = path.resolve(root)
    fs.access(resolvedRoot, fs.constants.F_OK | fs.constants.R_OK, (err) => {
      if (err) {
        // root is an url
        console.log('Redirecting to ' + root)
        resolve((req, res) => {
          res.redirect(root)
        })
      } else {
        // host the folder as static content
        console.log('Hosting the directory:', resolvedRoot)
        resolve(express.static(resolvedRoot))
      }
    })
  })
}

if (require.main === module) {
  startServer()
}
