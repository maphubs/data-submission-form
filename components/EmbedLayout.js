import React from 'react'
import Head from 'next/head'
import moment from 'moment'
import enUS from 'antd/lib/locale-provider/en_US'
import enGB from 'antd/lib/locale-provider/en_GB'
import 'moment/locale/en-gb'
import frFR from 'antd/lib/locale-provider/fr_FR'
import 'moment/locale/fr'
import esES from 'antd/lib/locale-provider/es_ES'
import 'moment/locale/es'
import deDE from 'antd/lib/locale-provider/de_DE'
import 'moment/locale/de'
import itIT from 'antd/lib/locale-provider/it_IT'
import 'moment/locale/it'
import ptBR from 'antd/lib/locale-provider/pt_BR'
import 'moment/locale/pt-br'
import ptPT from 'antd/lib/locale-provider/pt_PT'
import 'moment/locale/pt'

import NProgress from 'nprogress'
import Router from 'next/router'
import { Layout, LocaleProvider } from 'antd'

import styles from '../static/style.css'

Router.onRouteChangeStart = (url) => {
  // console.log(`Loading: ${url}`)
  NProgress.start()
}
Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()

const getAntLocale = (lang) => {
  if (!lang) throw new Error('language not set')
  console.log(lang)
  let antLocale
  if (lang === 'en' || lang === 'en-US') {
    antLocale = enUS
    moment.locale('en')
  } else if (lang === 'de' || lang === 'de-DE') {
    antLocale = deDE
    moment.locale('de')
  } else if (lang === 'es' || lang === 'es-ES') {
    antLocale = esES
    moment.locale('es')
  } else if (lang === 'fr' || lang === 'fr-FR') {
    antLocale = frFR
    moment.locale('fr')
  } else if (lang === 'it' || lang === 'it-IT') {
    antLocale = itIT
    moment.locale('it')
  } else if (lang === 'pt' || lang === 'pt-BR') {
    antLocale = ptBR
    moment.locale('pt')
  } else if (lang === 'pt-PT') {
    antLocale = ptPT
    moment.locale('pt')
  } else if (lang === 'en-GB') {
    antLocale = enGB
    moment.locale('en-GB')
  } else {
    antLocale = enUS
    moment.locale('en')
  }
  return antLocale
}

type Props = {
  language: string,
  title: string,
  children: any
}

type State = {
  collapsed: boolean
}

class EmbedLayout extends React.Component<Props, State> {
  state = {}

  render () {
    const {
      language, title, children
    } = this.props

    return (
      <div>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
          <title>{title}</title>         
        </Head>
        <style jsx global>{styles}</style>
        <LocaleProvider locale={getAntLocale(language)}>
          <Layout style={{ height: '100vh', minHeight: '100vh', background: 'none' }}>
            
            {children}
          </Layout>
        </LocaleProvider>
        
      </div>
    )
  }
}

export default EmbedLayout
