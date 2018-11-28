import React from 'react'
import Section from 'App/components/Section'
import PropTypes from 'prop-types'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import Account from './Account'
import DeveloperInfo from './DeveloperInfo'

@withMessage
export default class RegisterDeveloper extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    createDeveloper: PropTypes.func
  }

  state = {
    form: 'account',
    userId: ''
  }

  getSectionMessage() {
    if (this.state.form === 'account') {
      return 'Crea una cuenta de usuario'
    } else {
      return 'Ingresa tus datos de usuario'
    }
  }

  renderForms() {
    if (this.state.form === 'account') {
      return (
        <Account
          setUserId={(userId, form) => this.setState({ userId, form })}
        />
      )
    } else {
      return <DeveloperInfo userId={this.state.userId} />
    }
  }

  render() {
    return (
      <Section
        title="Regístrate como desarrollador"
        description={this.getSectionMessage()}
        top
      >
        {this.renderForms()}
      </Section>
    )
  }
}
