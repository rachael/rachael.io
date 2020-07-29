const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
.then(() => {
  const server = express()

  // resume, vcard pretty urls
  // only works for next.js Links
  server.get('/resume', (req, res) => {
    app.render(req, res, '/resume.pdf')
  })
  server.get('/vcard', (req, res) => {
    app.render(req, res, '/Rachael Passov.vcf')
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
