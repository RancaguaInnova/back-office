import React from 'react'
import Section from 'App/components/Section'
import Button from 'orionsoft-parts/lib/components/Button'
import { Form, Field } from 'simple-react-form'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import Rut from 'orionsoft-parts/lib/components/fields/Rut'
import Password from 'App/components/fields/Password'
import PropTypes from 'prop-types'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import gql from 'graphql-tag'
import UserFragments from 'App/fragments/User'
import omit from 'lodash/omit'

import styles from './styles.css'

@withMessage
@withMutation(gql`
  mutation createDeveloper($user: UserInput!) {
    createDeveloper(user: $user) {
      ...FullUser
    }
  }
  ${UserFragments.FullUser}
`)
export default class UpdateUser extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    createDeveloper: PropTypes.func
  }

  state = {}

  async onSubmit() {
    const { email } = this.state
    const user = Object.assign(
      { emails: [{ address: email, verified: false }] },
      omit(this.state, ['email'])
    )
    try {
      await this.props.createDeveloper({ user })
      this.props.showMessage('Cuenta de Desarrollador creada!')
    } catch (error) {
      this.props.showMessage('Hubo un error al guardar los datos')
      console.log('error:', error, '\n')
    }
  }

  render() {
    return (
      <Section
        title="Regístrate como desarrollador"
        description="Formulario de registro para
        desarrolladores"
        top
      >
        <Form state={this.state} onChange={changes => this.setState(changes)}>
          <div className={styles.headerLabel}>Cuenta:</div>
          <div className={styles.fieldGroup}>
            <div className={styles.label}>Email:</div>
            <Field fieldName="email" type={Text} />
            <div className={styles.label}>Contraseña:</div>
            <Field fieldName="password" type={Password} />
          </div>
          <div className={styles.headerLabel}>Datos de usuario:</div>
          <div className={styles.fieldGroup}>
            <div className={styles.label}>Nombre:</div>
            <Field fieldName="profile.firstName" type={Text} />
            <div className={styles.label}>Apellido:</div>
            <Field fieldName="profile.lastName" type={Text} />
            <div className={styles.label}>RUT:</div>
            <Field fieldName="profile.identifier" type={Rut} />
            <div className={styles.headerLabel}>Datos de contacto:</div>
            <div className={styles.fieldGroup}>
              <div className={styles.subheaderLabel}>Dirección:</div>
              <div className={styles.label}>Nombre de Calle:</div>
              <Field fieldName="profile.address.streetName" type={Text} />
              <div className={styles.label}>Numeración:</div>
              <Field fieldName="profile.address.streetNumber" type={Text} />
              <div className={styles.label}>Número de departamento o casa:</div>
              <Field fieldName="profile.address.departmentNumber" type={Text} />
              <div className={styles.subheaderLabel}>Teléfono:</div>
              <div className={styles.label}>Celular:</div>
              <Field fieldName="profile.phone.mobilePhone" type={Text} />
              <div className={styles.label}>Código de área:</div>
              <Field fieldName="profile.phone.areaCode" type={Text} />
              <div className={styles.label}>Numero:</div>
              <Field fieldName="profile.phone.number" type={Text} />
            </div>
          </div>
        </Form>
        <br />
        <Button to="/devs" style={{ marginRight: 10 }}>
          Cancelar
        </Button>
        <Button onClick={() => this.onSubmit()} primary>
          Guardar
        </Button>
      </Section>
    )
  }
}
