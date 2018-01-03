//  @flow
import React from 'react'
import DataSubmitWizard from '../components/DataSubmitWizard'

let xcomponent

type Props = {
  t: any,
  initialI18nStore: any,
  initialLanguage: string
}

type State = {
  loaded: boolean
}

export default class MapHubsDataSubmission extends React.Component<Props, State> {
  constructor () {
    super()
    this.state = {
      loaded: false
    }
  }

  componentDidMount () {
    // eslint-disable-next-line global-require
    xcomponent = require('xcomponent')
    xcomponent.create({
      tag: 'maphubs-data-submission-form',
      url: 'http://localhost:4004/xembed'
    })
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ loaded: true })
  }

  render () {
    if (this.state.loaded) {
      return (
        <DataSubmitWizard {...this.props} {...window.xprops} />
      )
    }
    return ''
  }
}
