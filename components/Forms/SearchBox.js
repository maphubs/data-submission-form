// @flow
import React from 'react'
import { AutoComplete } from 'antd'

const { Option } = AutoComplete

type Props = {
  handleSearch: Function,
  onOptionClick: Function,
  placeholder: string
}
type State = {
  result: Array<{key: string, value: string}>
}

export default class SearchBox extends React.Component<Props, State> {
  state = {
    result: []
  }

  onSelect = (key: string) => {
    console.log(`selecting: ${key}`)
    const { onOptionClick } = this.props
    this.state.result.forEach((item) => {
      if (item.key === key) {
        console.log(`FOUND: ${key}`)
        onOptionClick(item)
      }
    })
  }

  handleSearch = async (value: string) => {
    const result = await this.props.handleSearch(value)
    this.setState({ result })
  }

  render () {
    const { result } = this.state
    let options = []
    if (result) {
      options = result.map(value => (
        <Option
          key={value.key}
        >{value.value}
        </Option>
      ))
    }
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
        <div className='location-search-wrapper' style={{ width: 300 }} >
          <AutoComplete
            className='location-search'
            style={{ width: '100%' }}
            onSearch={this.handleSearch}
            placeholder={this.props.placeholder}
            dataSource={options}
            onSelect={this.onSelect}
            allowClear
          />
        </div>
      </div>
    )
  }
}
