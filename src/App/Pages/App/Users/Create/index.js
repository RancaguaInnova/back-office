import React from 'react'
import Section from 'App/components/Section'
import Button from 'orionsoft-parts/lib/components/Button'
import AutoForm from 'App/components/AutoForm'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'

@withRouter
@withMessage
export default class CreateUser extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    showMessage: PropTypes.func
  }

  onSuccess(user) {
    this.props.showMessage('Usuario creado')
    this.props.history.push(`/usuarios/editar/${user._id}`)
  }

  render() {
    return (
      <Section title="Crear Usuario" description="Crear un nuevo usuario" top>
        <AutoForm mutation="createUser" ref="form" onSuccess={this.onSuccess} />
        <br />
        <Button to="/usuarios/lista" style={{ marginRight: 10 }}>
          Cancelar
        </Button>
        <Button onClick={() => this.refs.form.submit()} primary>
          Crear Usuario
        </Button>
      </Section>
    )
  }
}
