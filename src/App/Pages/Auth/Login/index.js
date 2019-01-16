import React from 'react'
import { Form, Field } from 'simple-react-form'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import Button from 'orionsoft-parts/lib/components/Button'
import autobind from 'autobind-decorator'
import PropTypes from 'prop-types'
import withUserId from 'App/helpers/auth/withUserId'
import LoggedIn from '../LoggedIn'
import { Link } from 'react-router-dom'
import setSession from 'App/helpers/auth/setSession'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import gql from 'graphql-tag'

@withUserId
@withMutation(gql`
  mutation loginWithPassword($email: String!, $password: String!) {
    loginWithPassword(email: $email, password: $password) {
      _id
      locale
      roles
      userId
      emailVerified
      options
    }
  }
`)
export default class Login extends React.Component {
  static propTypes = {
    onLogin: PropTypes.func,
    userId: PropTypes.string,
    loginWithPassword: PropTypes.func
  }

  state = {
    email: '',
    password: ''
  }

  @autobind
  onSuccess(session) {
    setSession(session)
    this.props.onLogin()
  }

  @autobind
  async login() {
    try {
      let email = this.state.email
      let password = this.state.password
      const session = await this.props.loginWithPassword({ email, password })
      this.onSuccess(session)
    } catch (error) {
      console.log('Error login in:', error)
    }
  }

  render() {
    if (this.props.userId) return <LoggedIn />
    return (
      <div>
        <Form state={this.state} onChange={changes => this.setState(changes)}>
          <div className="label">Email</div>
          <Field fieldName="email" type={Text} placeholder="Email" />
          <div className="label">Password</div>
          <Field
            fieldName="password"
            type={Text}
            fieldType="password"
            placeholder="Password"
          />
          <div className="description">
            <Link to="/forgot">Olvidé mi contraseña</Link>
          </div>
        </Form>
        <br />
        <Button onClick={() => this.login()} primary>
          Login
        </Button>
        <br />
        <br />
        <div>
          Si no tienes una cuenta, <Link to="/register">Registrate</Link>
        </div>
      </div>
    )
  }
}
