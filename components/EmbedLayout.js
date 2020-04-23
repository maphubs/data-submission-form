import React from 'react'
import Head from 'next/head'

import { Layout, ConfigProvider } from 'antd'

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
      title, children
    } = this.props

    return (
      <div>
        <Head>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta charSet='utf-8' />
          <title>{title}</title>
        </Head>
        <ConfigProvider locale='en'>
          <Layout style={{ height: '100vh', minHeight: '100vh', background: 'none' }}>
            {children}
          </Layout>
        </ConfigProvider>
      </div>
    )
  }
}

export default EmbedLayout
