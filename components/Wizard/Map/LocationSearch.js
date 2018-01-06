// @flow
import React from 'react'
import request from 'superagent'
import { message } from 'antd'
import SearchBox from '../../Forms/SearchBox'

import config from '../../../utils/env'

type Props = {
  onOptionClick: Function
}
type State = {}

export default class LocationSearch extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {}
  }

  handleSearch = (value: string) => {
    if (!value) return null
    const url = `https://geocoder.tilehosting.com/q/${value}.js?key=${config.OSMNAMES_API_KEY}`
    return request.get(url)
      .then((res) => {
        const { count, results } = res.body
        if (count > 0 && results) {
          const features = results.map((feature) => {
            /* eslint-disable camelcase */
            const { id, name, display_name } = feature
            return {
              key: `${id}`,
              value: display_name || name,
              feature
            }
          })
          return (features)
        } // else
        throw new Error('features not found')
      })
      .catch((err) => {
        console.error(err)
        message.error(`Error: ${err.message}`)
      })
  }

  render () {
    return (
      <SearchBox
        handleSearch={this.handleSearch}
        onOptionClick={this.props.onOptionClick}
        placeholder="Search for a City or Place"
      />
    )
  }
}
