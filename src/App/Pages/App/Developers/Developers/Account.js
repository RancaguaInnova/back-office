import React from 'react'
import Button from 'orionsoft-parts/lib/components/Button'
import { Form, Field } from 'simple-react-form'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import Rut from 'orionsoft-parts/lib/components/fields/Rut'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import PropTypes from 'prop-types'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import gql from 'graphql-tag'
import setSession from 'App/helpers/auth/setSession'

import styles from './styles.css'

@withMessage
@withMutation(gql`
  mutation createUser(
    $email: String!
    $password: String!
    $profile: UserProfileInput
  ) {
    createUser(email: $email, password: $password, profile: $profile) {
      _id
      publicKey
      secretKey
      userId
      createdAt
      nonce
      lastCall
      locale
      roles
      emailVerified
      options
    }
  }
`)
@withMutation(gql`
  mutation loginWithPassword($email: String!, $password: String!) {
    loginWithPassword(email: $email, password: $password) {
      _id
    }
  }
`)
export default class CreateDeveloperAccount extends React.Component {
  static propTypes = {
    createUser: PropTypes.func,
    setUserId: PropTypes.func,
    showMessage: PropTypes.func
  }

  state = {}

  async onSubmit() {
    let {
      email,
      password,
      repeatPassword,
      profile: { identifier }
    } = this.state

    if (!email) {
      this.props.showMessage('Ingresa un email válido')
      return
    } else if (!identifier) {
      this.props.showMessage('Ingresa tu rut')
      return
    } else if (password !== repeatPassword) {
      this.props.showMessage('Las contraseñas no coinciden')
      return
    } else if (!password || !repeatPassword) {
      this.props.showMessage('Ingresa una contraseña')
      return
    }

    let profile = { identifier }
    try {
      const { createUser } = await this.props.createUser({
        email,
        password,
        profile
      })
      setSession(createUser)
      this.props.setUserId(createUser.userId, 'info')
    } catch (error) {
      this.props.showMessage('Hubo un error al crear la cuenta')
      console.log('error:', error)
    }
  }

  render() {
    return (
      <div>
        <Form state={this.state} onChange={changes => this.setState(changes)}>
          <div className={styles.headerLabel}>Cuenta:</div>
          <div className={styles.fieldGroup}>
            <div className={styles.label}>Email:</div>
            <Field fieldName="email" type={Text} />
            <div className={styles.label}>Rut:</div>
            <Field fieldName="profile.identifier" type={Rut} />
            <div className={styles.label}>
              Contraseña (mínimo 8 caracteres):
            </div>
            <Field fieldName="password" type={Text} fieldType="password" />
            <div className={styles.label}>Repetir Contraseña:</div>
            <Field
              fieldName="repeatPassword"
              type={Text}
              fieldType="password"
            />
          </div>
        </Form>
        <br />
        <Button to="/devs" style={{ marginRight: 10 }}>
          Cancelar
        </Button>
        <Button onClick={() => this.onSubmit()} primary>
          Guardar
        </Button>
      </div>
    )
  }
}
