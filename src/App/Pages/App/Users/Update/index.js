import React from 'react'
import Template from '../Template/'
import PropTypes from 'prop-types'

export default class CreateApplication extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    eventId: PropTypes.string,
    user: PropTypes.object,
    applicationId: PropTypes.string
  }

  render() {
    return (
      <Template
        type='update'
        eventId={this.props.eventId}
        title='Actualizar usuario'
        description='Actualizando usuario'
        history={this.props.history}
        user={this.props.user}
      />
    )
  }
}
