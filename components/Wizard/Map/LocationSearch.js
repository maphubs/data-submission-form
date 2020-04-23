// @flow
import React from 'react'
import request from 'superagent'
import { message } from 'antd'
import SearchBox from '../../Forms/SearchBox'

import getConfig from 'next/config'
const config = getConfig().publicRuntimeConfig

type Props = {
  onOptionClick: Function
}
type State = {}

export default class LocationSearch extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {}
  }

  handleSearch = (query: string) => {
    if (!query) return null
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${config.MAPBOX_ACCESS_TOKEN}&autocomplete=true`

    return request.get(url)
      .then((res) => {
        const { features } = res.body
        if (features && features.length > 0) {
          const featuresCleaned = features.map((feature) => {
            return {
              key: `${feature.id}`,
              value: feature.matching_place_name || feature.place_name || feature.text,
              feature
            }
          })
          return featuresCleaned
        } // elsefeatures
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
        placeholder='Search for a City or Place'
      />
    )
  }
}
