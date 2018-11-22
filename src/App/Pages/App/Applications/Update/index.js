import React from 'react'
import Section from 'App/components/Section'
import Button from 'orionsoft-parts/lib/components/Button'
import { Form, Field } from 'simple-react-form'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import Toggle from 'orionsoft-parts/lib/components/fields/Toggle'
import Rut from 'orionsoft-parts/lib/components/fields/Rut'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import gql from 'graphql-tag'
import omit from 'lodash/omit'
import UserFragments from 'App/fragments/User'

@withRouter
@withMessage
@withGraphQL(gql`
  query user($userId: ID!) {
    user(userId: $userId) {
      ...FullUser
    }
  }
  ${UserFragments.FullUser}
`)
@withMutation(gql`
  mutation updateUser($user: UserInput!) {
    updateUser(user: $user) {
      ...FullUser
    }
  }
  ${UserFragments.FullUser}
`)
export default class UpdateUser extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    showMessage: PropTypes.func,
    user: PropTypes.object,
    updateUser: PropTypes.func
  }

  state = {}

  componentDidMount() {
    this.setState({ ...this.props.user })
  }

  async onSubmit() {
    const { email } = this.state
    const user = Object.assign(
      { emails: [{ address: email, verified: false }] },
      omit(this.state, ['email'])
    )
    try {
      await this.props.updateUser({ user })
      this.props.showMessage('Usuario actualizado')
    } catch (error) {
      this.props.showMessage('Hubo un error al guardar los datos')
      console.log('error:', error, '\n')
    }
  }

  render() {
    return (
      <Section title="Editar Usuario" description="Editar un usuario" top>
        <Form state={this.state} onChange={changes => this.setState(changes)}>
          <div className="label">Email:</div>
          <Field fieldName="email" type={Text} />
          <div className="label">Nombre:</div>
          <Field fieldName="profile.firstName" type={Text} />
          <div className="label">Apellido:</div>
          <Field fieldName="profile.lastName" type={Text} />
          <div className="label">RUT:</div>
          <Field fieldName="profile.identifier" type={Rut} />
          <div className="label">
            DIRECCIÓN:
            <div className="label">Nombre de Calle:</div>
            <Field fieldName="profile.address.streetName" type={Text} />
            <div className="label">Numeración:</div>
            <Field fieldName="profile.address.streetNumber" type={Text} />
            <div className="label">Número de departamento o casa:</div>
            <Field fieldName="profile.address.departmentNumber" type={Text} />
          </div>
          <div className="label">
            TELÉFONO:
            <div className="label">Celular:</div>
            <Field fieldName="profile.phone.mobilePhone" type={Text} />
            <div className="label">Código de área:</div>
            <Field fieldName="profile.phone.areaCode" type={Text} />
            <div className="label">Numero:</div>
            <Field fieldName="profile.phone.number" type={Text} />
          </div>
          <div className="label">Nivel Educacional:</div>
          <Field
            fieldName="profile.educationalLevel"
            name="Nivel Educacional"
            type={Select}
            placeholder="Seleccionar:"
            options={[
              { label: 'Educación Básica', value: 'basica' },
              { label: 'Educación Media', value: 'media' },
              { label: 'Educación Superior', value: 'superior' }
            ]}
          />
          <div className="label">Usuario Activo:</div>
          <Field fieldName="active" type={Toggle} />
        </Form>
        <br />
        <Button to="/usuarios/lista" style={{ marginRight: 10 }}>
          Cancelar
        </Button>
        <Button onClick={() => this.onSubmit()} primary>
          Guardar
        </Button>
      </Section>
    )
  }
}
