#!/usr/bin/env node
const path = require('path')
const fs = require('fs')

const express = require('express')
const app = express()

const proxy = require('http-proxy-middleware')

const opn = require('opn')

const argv = require('minimist')(process.argv.slice(2), {boolean: ['l']})

async function startServer () {
  // /root - where the game in developement is hosted
  app.use('/root', await rootMiddleware())
  // everything else is assets that are proxied from Dividat Play
  app.use(assetsMiddleware())

  app.listen(8388, function () {
    console.log('http://localhost:8388/')
    opn('http://localhost:8388')
  })
}

function assetsMiddleware () {
  // Dividat developers only: use the '-l' flag to use local development assets
  const assetsLocation = argv['l'] ? 'http://localhost:8080/' : 'https://play.dividat.com/'
  return proxy({
    target: assetsLocation,
    pathRewrite: {
      '^/$': '/playDev.html'
    },
    changeOrigin: true,
    logLevel: 'warn'
  })
}

function rootMiddleware () {
  const root = argv._[0] || '.'
  return new Promise((resolve, reject) => {
    const resolvedRoot = path.resolve(root)
    // Check if folder exists
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
