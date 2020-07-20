import AutoForm from 'App/components/AutoForm'
import withUserId from 'App/helpers/auth/withUserId'
import autobind from 'autobind-decorator'
import Button from 'orionsoft-parts/lib/components/Button'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import PropTypes from 'prop-types'
import React from 'react'
import { Field } from 'simple-react-form'
import LoggedIn from '../LoggedIn'

@withUserId
@withMessage
export default class ForgotPassword extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    userId: PropTypes.string,
  }

  @autobind
  onSuccess() {
    this.props.showMessage('Te hemos enviado instrucciones a tu email')
  }

  render() {
    if (this.props.userId) return <LoggedIn />
    return (
      <div>
        <AutoForm
          mutation="forgotPassword"
          ref="form"
          onSuccess={this.onSuccess}
        >
          <div className="label">Email</div>
          <Field
            fieldName="email"
            type={Text}
            placeholder="El email de tu cuenta"
            fieldType="email"
          />
        </AutoForm>
        <br />
        <Button onClick={() => this.refs.form.submit()} primary>
          Cambiar contraseña
        </Button>
        <br />
        <br />
      </div>
    )
  }
}
