import React from 'react'
import Section from 'App/components/Section'
import Button from 'orionsoft-parts/lib/components/Button'
import AutoForm from 'App/components/AutoForm'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'

@withRouter
export default class CreateUser extends React.Component {
  static propTypes = {
    history: PropTypes.object
  }

  render() {
    return (
      <Section title="Crear Usuario" description="Crear un nuevo usuario" top>
        <AutoForm
          mutation="createUser"
          ref="form"
          onSuccess={user => this.props.history.push(`/${user._id}`)}
        />
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
