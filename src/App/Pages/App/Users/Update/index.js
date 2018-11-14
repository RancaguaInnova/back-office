import React from 'react'
import Section from 'App/components/Section'
import Button from 'orionsoft-parts/lib/components/Button'
import AutoForm from 'App/components/AutoForm'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'

@withRouter
@withMessage
@withGraphQL(gql`
  query user($userId: ID!) {
    user(userId: $userId) {
      emails {
        address
        verified
      }
      profile {
        firstName
        lastName
        identifier
        educationalLevel
      }
    }
  }
`)
export default class UpdateUser extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    showMessage: PropTypes.func
  }

  render() {
    return (
      <Section title="Editar Usuario" description="Editar un usuario" top>
        <AutoForm
          mutation="updateUser"
          ref="form"
          onSuccess={() =>
            this.props.showMessage('Cambios guardado exitosamente')
          }
          omit={['_id', 'token', 'roles']}
        />
        <br />
        <Button to="/usuarios/lista" style={{ marginRight: 10 }}>
          Cancelar
        </Button>
        <Button onClick={() => this.refs.form.submit()} primary>
          Guardar
        </Button>
      </Section>
    )
  }
}
