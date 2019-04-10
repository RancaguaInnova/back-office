import React from 'react'
import Template from '../Template/'
import PropTypes from 'prop-types'

export default class UpdateEvent extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    eventId: PropTypes.string
  }
  render() {
    return (
      <Template
        type='update'
        eventId={this.props.eventId}
        title='Actualizar Evento'
        description='Actualizando evento'
        history={this.props.history}
      />
    )
  }
}
