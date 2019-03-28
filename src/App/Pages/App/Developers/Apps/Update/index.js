import React from 'react'
import Template from '../Template/'
import PropTypes from 'prop-types'
export default class CreateApplication extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    userId: PropTypes.string,
    user: PropTypes.object,
    applicationId: PropTypes.string
  }
  render() {
    return (
      <Template
        type='update'
        applicationId={this.props.applicationId}
        title='Actualizar Aplicación'
        description='Actualizando aplicación'
        history={this.props.history}
        user={this.props.user}
      />
    )
  }
}
