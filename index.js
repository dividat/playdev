#!env node
const express = require('express')
const app = express()
const path = require('path')
const argv = require('minimist')(process.argv.slice(2))

if (require.main === module) {
  const root = path.resolve(argv._[0] || '.')
  console.log('Starting Play[dev] in folder:', root)

  app.use('/root', express.static(root))

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
