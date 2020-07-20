import { setSession } from '@orion-js/graphql-client';
import AutoForm from 'App/components/AutoForm';
import withUserId from 'App/helpers/auth/withUserId';
import autobind from 'autobind-decorator';
import Button from 'orionsoft-parts/lib/components/Button';
import Text from 'orionsoft-parts/lib/components/fields/Text';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { Field } from 'simple-react-form';

import LoggedIn from '../LoggedIn';

// import Translate from 'App/i18n'
// import translate from 'App/i18n/translate'

@withUserId
export default class Login extends React.Component {
  static propTypes = {
    onLogin: PropTypes.func,
    userId: PropTypes.string,
    loading: PropTypes.bool
  }

  @autobind
  async onSuccess(session) {
    await setSession(session)
    this.props.onLogin()
  }

  render() {
    if (!this.props.loading && this.props.userId) {
      return <LoggedIn userId={this.props.userId} />
    }
    return (
      <div>
        <AutoForm mutation='loginWithPassword' ref='form' onSuccess={this.onSuccess}>
          <div className='label'>Email</div>
          <Field fieldName='email' type={Text} fieldType='email' placeholder='Email' />
          <div className='label'>Contraseña</div>
          <Field
            fieldName='password'
            type={Text}
            fieldType='password'
            placeholder='Ingresa tu contraseña'
          />
          <div className='description'>
            <Link to='/forgot'>Olvidé mi contraseña</Link>
          </div>
        </AutoForm>
        <br />
        <Button style={{ marginRight: 10 }} to='/register'>
          Crear Cuenta
        </Button>
        <Button onClick={() => this.refs.form.submit()} primary loading={this.props.loading}>
          Iniciar Sesión
        </Button>
      </div>
    )
  }
}
