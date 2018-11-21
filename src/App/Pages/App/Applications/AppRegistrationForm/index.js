import React from 'react'
import Section from 'App/components/Section'
import Button from 'orionsoft-parts/lib/components/Button'
import AutoForm from 'App/components/AutoForm'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'

@withRouter
@withMessage
export default class AppRegistrationForm extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    showMessage: PropTypes.func
  }

  onSuccess(app) {
    this.props.showMessage(
      'Aplicación registrada. Recibirás un correo cuando sea aprobada'
    )
    this.props.history.push(`/apps`)
  }

  render() {
    return (
      <Section
        title="Registro de integraciones"
        description="Registra tu aplicación llenando este
        formulario. Recibirás un email cuando tu aplicación sea aprobada"
        top
      >
        <AutoForm
          mutation="createApplication"
          ref="form"
          onSuccess={this.onSuccess}
        />
        <br />
        <Button to="/" style={{ marginRight: 10 }}>
          Cancelar
        </Button>
        <Button onClick={() => this.refs.form.submit()} primary>
          Registrar Aplicación
        </Button>
      </Section>
    )
  }
}
