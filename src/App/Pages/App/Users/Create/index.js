import React from 'react'
import Template from '../Template/'
import PropTypes from 'prop-types'
export default class CreateUser extends React.Component {
  static propTypes = {
    history: PropTypes.object
  }
  render() {
    return (
      <Template
        type='create'
        userId=''
        title='Crear Usuario'
        description='Creación de usuarios'
        history={this.props.history}
      />
    )
  }
}
