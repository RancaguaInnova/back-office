import AutoForm from 'App/components/AutoForm';
import setSession from 'App/helpers/auth/setSession';
import withUserId from 'App/helpers/auth/withUserId';
import autobind from 'autobind-decorator';
import Text from 'orionsoft-parts/lib/components/fields/Text';
import withMessage from 'orionsoft-parts/lib/decorators/withMessage';
import PropTypes from 'prop-types';
import React from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Field } from 'simple-react-form';

import LoggedIn from '../LoggedIn';

@withUserId
@withMessage
export default class ResetPassword extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    onLogin: PropTypes.func,
    userId: PropTypes.string,
    token: PropTypes.string
  }

  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  schema = {
    password: {
      type: String,
      min: 8
    },
    confirm: {
      type: String,
      custom(
        confirm,
        {
          doc: { password }
        }
      ) {
        if (confirm !== password) {
          return 'Contraseñas no coinciden'
        }
      }
    },
    token: {
      type: String
    }
  }

  @autobind
  onSuccess(session) {
    setSession(session)
    this.props.showMessage('Tu contraseña ha sido cambiada exitosamente!')
    this.props.onLogin()
  }

  @autobind
  onValidationError({ token }) {
    if (token === 'tokenNotFound') {
      this.setState({
        error:
          'El link para restablecer su contraseña a expirado, para restablecer su contraseña vuelva a la aplicacion y realice nuevamente el proceso de restablecer contraseña'
      })
    }
  }

  render() {
    if (this.props.userId) return <LoggedIn />
    return (
      <Container>
        {!this.state.error ? (
          <Row>
            <Col>
              <AutoForm
                doc={{ token: this.props.token }}
                mutation='resetPassword'
                ref='form'
                schema={this.schema}
                onSuccess={this.onSuccess}
                onValidationError={this.onValidationError}
              >
                <h2>Restablecer Contraseña</h2>
                <br />
                <Form.Label>Nueva Contraseña</Form.Label>
                <Field
                  fieldName='password'
                  fieldType='password'
                  placeholder='Nueva contraseña'
                  type={Text}
                />
                <Form.Text className='text-muted'>
                  <Alert variant={'info'}>
                    Tu contraseña debe tener al menos 8 caracteres de largo
                  </Alert>
                </Form.Text>

                <Form.Label>Confirmar nueva contraseña</Form.Label>
                <Field
                  fieldName='confirm'
                  fieldType='password'
                  placeholder='Confirmar'
                  type={Text}
                />
              </AutoForm>
              <Button
                variant='primary'
                size='lg'
                block
                onClick={() => this.refs.form.submit()}
                primary
              >
                Aceptar
              </Button>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col>
              <Alert variant={'danger'}>{this.state.error}</Alert>
            </Col>
          </Row>
        )}
      </Container>
    )
  }
}
