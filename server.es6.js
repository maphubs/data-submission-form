// @flow
/* eslint-disable no-console */
const express = require('express')
const path = require('path')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
// const handle = app.getRequestHandler()

const i18nextMiddleware = require('i18next-express-middleware')
const Backend = require('i18next-node-fs-backend')
const i18n = require('./i18n')
const config = require('./config')

// init i18next with serverside settings
// using i18next-express-middleware
i18n
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    preload: ['en', 'de', 'fr', 'es'], // preload all langages
    ns: ['common', 'wizard'], // need to preload all the namespaces
    backend: {
      loadPath: path.join(__dirname, '/locales/{{lng}}/{{ns}}.json'),
      addPath: path.join(__dirname, '/locales/{{lng}}/{{ns}}.missing.json')
    }
  }, () => {
    // loaded translations we can bootstrap our routes
    app.prepare()
      .then(() => {
        const server = express()

        // server static CSS file
        server.use('/static', express.static('static'))

        // enable middleware for i18next
        server.use(i18nextMiddleware.handle(i18n))

        // serve locales for client
        server.use('/locales', express.static(path.join(__dirname, '/locales')))

        // missing keys
        server.post('/locales/add/:lng/:ns', i18nextMiddleware.missingKeyHandler(i18n))

        // for now any path renders the main page
        server.get('*', (req, res) => {
          app.render(req, res, '/index')
        })

        // use next.js pages
        // server.get('*', (req, res) => handle(req, res))

        return server.listen(config.port, (err) => {
          if (err) throw err
          console.log(`> Ready on http://localhost:${config.port}`)
        })
      }).catch((err) => {
        console.error(err)
      })
  })
