// @flow
import React from 'react'
import { AutoComplete } from 'antd'

type Props = {
  handleSearch: Function,
  onOptionClick: Function,
  placeholder: string
}
type State = {
  results: Array<{key: string, value: string}>
}

export default class SearchBox extends React.Component<Props, State> {
  state = {
    results: []
  }

  onSelect = (value: string, item: any) => {
    console.log(`selecting: ${item}`)
    this.props.onOptionClick(item)
  }

  handleSearch = async (value: string) => {
    const results = await this.props.handleSearch(value)
    this.setState({ results })
  }

  render () {
    const { results } = this.state

    return (
      <div>
        <style jsx>{`
          .location-search-wrapper {
            padding-right: 50px;
          }
          
          .location-search {
            width: 100%;
          }
          
          .location-search.ant-select-auto-complete .ant-select-selection--single {
            margin-right: -46px;
          }
          
          .location-search.ant-select-auto-complete .ant-input-affix-wrapper .ant-input:not(:last-child) {
            padding-right: 62px;
          }
          
          .location-search.ant-select-auto-complete .ant-input-affix-wrapper .ant-input-suffix {
            right: 0;
          }
          
          .location-search.ant-select-auto-complete .ant-input-affix-wrapper .ant-input-suffix button {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
          }
          
          .location-search-item-count {
            position: absolute;
            right: 16px;
          }

          .ant-select-dropdown-menu {
            z-index: 2;
          }
        `}
        </style>
        <div className='location-search-wrapper' style={{ width: 300 }}>
          <AutoComplete
            className='location-search'
            style={{ width: '100%' }}
            onSearch={this.handleSearch}
            placeholder={this.props.placeholder}
            options={results}
            onSelect={this.onSelect}
            allowClear
          />
        </div>
      </div>
    )
  }
}
