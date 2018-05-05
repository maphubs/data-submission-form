import React from 'react'
import Document_, { Head, Main, NextScript } from 'next/document'
import htmlescape from 'htmlescape'

import { createHash } from 'crypto'
import { readFileSync } from 'fs'

let version = ''
if (process.env.NODE_ENV === 'production') {
  const hash = createHash('sha256')
  hash.update(readFileSync(`${process.cwd()}/static/style.css`))
  version = `?v=${hash.digest('hex').substr(0, 8)}`
}

let env = {}
if (process.env.APP_ENV !== 'browser') {
  // eslint-disable-next-line global-require
  env = require('../client-config')
}

export default class Document extends Document_ {
  static async getInitialProps (ctx) {
    const props = await Document_.getInitialProps(ctx)
    return props
  }

  render () {
    return (
      <html>
        <Head>
          <link rel='stylesheet' href={`/static/style.css${version}`} />
        </Head>
        <body>
          <Main />
          <script
            dangerouslySetInnerHTML={{ __html: '__ENV__ = ' + htmlescape(env) }}
          />
          <NextScript />
        </body>
      </html>
    )
  }
}
