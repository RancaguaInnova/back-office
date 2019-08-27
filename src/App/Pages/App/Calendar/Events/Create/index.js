import React from 'react'
import Template from '../Template/'
import PropTypes from 'prop-types'

export default class CreateEvents extends React.Component {
  static propTypes = {
    history: PropTypes.object
  }
  render () {
    return (
      <Template
        type='create'
        eventId=''
        title='Crear evento'
        description='Creación de eventos'
        history={this.props.history}
      />
    )
  }
}
