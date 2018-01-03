// @flow
import React from 'react'
import request from 'superagent'
import { message } from 'antd'
import SearchBox from '../../Forms/SearchBox'

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
    const url = `https://search.mapzen.com/v1/autocomplete?text=${value}&api_key=mapzen-7K425Zt`
    return request.get(url)
      .then((res) => {
        const { features } = res.body
        if (features) {
          const results = features.map((feature) => {
            const { id, name, label } = feature.properties
            return {
              key: id,
              value: label || name,
              feature
            }
          })
          return (results)
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
      <SearchBox handleSearch={this.handleSearch} onOptionClick={this.props.onOptionClick} />
    )
  }
}
