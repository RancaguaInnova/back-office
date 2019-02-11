import React from 'react'
import PropTypes from 'prop-types'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import { Field } from 'simple-react-form'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import autobind from 'autobind-decorator'
import includes from 'lodash/includes'

@withApollo
export default class Relation extends React.Component {
  static propTypes = {
    client: PropTypes.object,
    fieldName: PropTypes.string,
    optionsQueryName: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
  }

  state = {
    options: [],
    value: ''
  }

  async componentDidMount() {
    let { optionsQueryName } = this.props
    if (!optionsQueryName) optionsQueryName = this.getQueryName()
    const query = gql`
      {
        ${optionsQueryName} {
          items {
            label: optionLabel
            value: _id
          }
        }
      }
    `
    const { data } = await this.props.client.query({ query })
    this.setState({ options: data[optionsQueryName].items })
  }

  getQueryName() {
    const { fieldName, optionsQueryName } = this.props
    if (includes(fieldName, 'managerId')) {
      return 'officials'
    } else {
      return optionsQueryName
    }
  }

  @autobind
  onChange(value) {
    this.setState({ value })
    this.props.onChange(value)
  }

  renderLabel() {
    if (!this.props.label) return
    return <div>{this.props.label}</div>
  }

  render() {
    return (
      <div>
        {this.renderLabel()}
        <Field
          fieldName={this.props.fieldName}
          type={Select}
          options={this.state.options}
          onChange={this.onChange}
          value={this.props.value || this.state.value}
        />
      </div>
    )
  }
}
