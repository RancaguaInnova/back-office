import React from 'react'
import Section from 'App/components/Section'
import Button from 'orionsoft-parts/lib/components/Button'
import AutoForm from 'App/components/AutoForm'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'

@withRouter
@withMessage
export default class CreateEvent extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    showMessage: PropTypes.func
  }

  onSuccess(event) {
    this.props.showMessage('Evento creado')
    this.props.history.push(`/calendario/eventos`)
  }

  render() {
    console.log('asdfasd')
    return (
      <Section title="Crear Evento" description="Crear un nuevo evento" top>
        <AutoForm
          mutation="createEvent"
          ref="form"
          onSuccess={this.onSuccess}
        />
        <br />
        <Button to="/calendar/eventos" style={{ marginRight: 10 }}>
          Cancelar
        </Button>
        <Button onClick={() => this.refs.form.submit()} primary>
          Crear Evento
        </Button>
      </Section>
    )
  }
}
