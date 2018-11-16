import React from 'react'
import PropTypes from 'prop-types'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'

@withGraphQL(gql`
  query getParams($name: ID) {
    params(name: $name, mutation: true) {
      name
      result
      basicResultQuery
      params
    }
  }
`)
export default class AutoFormWithSchema extends React.Component {
  static propTypes = {
    children: PropTypes.func,
    params: PropTypes.object
  }

  render() {
    if (!this.props.params) return
    return this.props.children(this.props.params)
  }
}
