import React from 'react'
import AutoForm from 'App/components/AutoForm'
import { Field } from 'simple-react-form'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import Button from 'orionsoft-parts/lib/components/Button'
import autobind from 'autobind-decorator'
import PropTypes from 'prop-types'
import withUserId from 'App/helpers/auth/withUserId'
import LoggedIn from '../LoggedIn'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import setSession from 'App/helpers/auth/setSession'

@withUserId
@withMessage
export default class ResetPassword extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    onLogin: PropTypes.func,
    userId: PropTypes.string,
    token: PropTypes.string
  }

  schema = {
    password: {
      type: String,
      min: 8
    },
    confirm: {
      type: String,
      custom(confirm, { doc: { password } }) {
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
      this.props.showMessage('El link ha expirado. Por favor intenta de nuevo.')
    }
  }

  render() {
    if (this.props.userId) return <LoggedIn />
    return (
      <div>
        <AutoForm
          doc={{ token: this.props.token }}
          mutation="resetPassword"
          ref="form"
          schema={this.schema}
          onSuccess={this.onSuccess}
          onValidationError={this.onValidationError}
        >
          <div className="label">Nueva Contraseña</div>
          <Field
            fieldName="password"
            fieldType="password"
            placeholder="Nueva contraseña"
            type={Text}
          />
          <div className="description">
            Tu contraseña debe tener al menos 8 caracteres de largo
          </div>
          <div className="label">Confirmar nueva contraseña</div>
          <Field
            fieldName="confirm"
            fieldType="password"
            placeholder="Confirmar"
            type={Text}
          />
        </AutoForm>
        <br />
        <Button onClick={() => this.refs.form.submit()} primary>
          Reestablecer Contraseña
        </Button>
        <br />
        <br />
      </div>
    )
  }
}
