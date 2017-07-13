#!env node
const express = require('express')
const app = express()
const path = require('path')
const argv = require('minimist')(process.argv.slice(2))

if (require.main === module) {
  const externalPath = argv._[0] || '.'

  app.use('/root', express.static(externalPath))
  console.log(externalPath)

  app.use(express.static(path.join(__dirname, 'assets')))

  app.listen(8388, function () {
    console.log('http://localhost:8388/')
  })
}
