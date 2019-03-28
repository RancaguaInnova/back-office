import React from 'react'
import Template from '../Template/'
import PropTypes from 'prop-types'
export default class CreateApplication extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    userId: PropTypes.string,
    user: PropTypes.object
  }
  render() {
    return (
      <Template
        type='create'
        applicationId=''
        title='Crear Aplicación'
        description='Crear nueva aplicación'
        history={this.props.history}
        user={this.props.user}
      />
    )
  }
}
