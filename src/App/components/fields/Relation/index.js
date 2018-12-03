import React from 'react'
import PropTypes from 'prop-types'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import { Field } from 'simple-react-form'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import autobind from 'autobind-decorator'

@withApollo
export default class Relation extends React.Component {
  static propTypes = {
    client: PropTypes.object,
    fieldName: PropTypes.string,
    optionsQueryName: PropTypes.string
  }

  state = {
    options: [],
    value: ''
  }

  async componentDidMount() {
    const { optionsQueryName } = this.props
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

  @autobind
  onChange(value) {
    this.setState({ value })
  }

  render() {
    return (
      <Field
        fieldName={this.props.fieldName}
        type={Select}
        options={this.state.options}
      />
    )
  }
}
