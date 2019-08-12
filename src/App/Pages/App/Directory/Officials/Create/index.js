import React, { Component } from 'react'
import Template from '../Template/'
import PropTypes from 'prop-types'

export default class CreateOfficial extends Component {
  static propTypes = {
    history: PropTypes.object
  }
  render() {
    return (
      <Template
        type='create'
        officialId=''
        title='Crea el registro de funcionarios '
        description=''
        history={this.props.history}
      />
    )
  }
}
