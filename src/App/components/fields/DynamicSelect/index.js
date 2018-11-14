import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import {Async} from 'react-select'
import autobind from 'autobind-decorator'
import {withApollo} from 'react-apollo'
import gql from 'graphql-tag'

@withApollo
export default class DynamicSelect extends React.Component {
  static propTypes = {
    client: PropTypes.object,
    value: PropTypes.string,
    onChange: PropTypes.func,
    valueKey: PropTypes.string,
    labelKey: PropTypes.string,
    searchQuery: PropTypes.string,
    passProps: PropTypes.object,
    fieldName: PropTypes.string,
    multi: PropTypes.bool
  }

  static defaultProps = {
    valueKey: '_id',
    labelKey: 'name'
  }

  async getItems(filter) {
    const queryString = `query dynamicSelectSearch_${this.props.searchQuery} ($filter: String) {
        result: ${this.props.searchQuery} (filter: $filter, page: 1, limit: 6) {
          items {
            ${this.props.valueKey}
            ${this.props.labelKey}
          }
        }
    }`
    const query = gql([queryString])
    const {data: {result: {items}}} = await this.props.client.query({
      query,
      variables: {filter}
    })
    return items
  }

  @autobind
  async loadOptions(input, callback) {
    const items = await this.getItems(input)
    const options = items.map(item => {
      return {
        label: item[this.props.labelKey],
        value: item[this.props.valueKey]
      }
    })
    callback(null, {options})
    return options
  }

  @autobind
  onChange(item) {
    const items = this.props.multi ? item : item ? [item] : []
    if (items.length) {
      const values = items.map(item => item.value)
      const finalValue = this.props.multi ? values : values[0]
      this.props.onChange(finalValue)
    } else {
      this.props.onChange(null)
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <Async
          name={this.props.fieldName}
          loadOptions={this.loadOptions}
          value={this.props.value}
          multi={this.props.multi}
          filterOption={() => true}
          onChange={this.onChange}
          {...this.props.passProps}
        />
      </div>
    )
  }
}
