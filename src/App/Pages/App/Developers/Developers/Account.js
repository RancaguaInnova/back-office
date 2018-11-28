import React from 'react'
import Button from 'orionsoft-parts/lib/components/Button'
import { Form, Field } from 'simple-react-form'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import Rut from 'orionsoft-parts/lib/components/fields/Rut'
import Password from 'App/components/fields/Password'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import PropTypes from 'prop-types'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import gql from 'graphql-tag'

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
    }
  }
`)
export default class CreateDeveloperAccount extends React.Component {
  static propTypes = {
    createUser: PropTypes.func,
    setUserId: PropTypes.func
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
      const { createUser: { _id } } = await this.props.createUser({
        email,
        password,
        profile
      })
      this.props.setUserId(_id, 'info')
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
            <Field fieldName="password" type={Password} />
            <div className={styles.label}>Repetir Contraseña:</div>
            <Field fieldName="repeatPassword" type={Password} />
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
