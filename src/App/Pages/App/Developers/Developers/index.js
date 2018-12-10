import React from 'react'
import Section from 'App/components/Section'
import PropTypes from 'prop-types'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import withUserId from 'App/helpers/auth/withUserId'
import autobind from 'autobind-decorator'
import Account from './Account'
import DeveloperInfo from './DeveloperInfo'
import Button from 'orionsoft-parts/lib/components/Button'
import { withRouter } from 'react-router-dom'

@withRouter
@withMessage
@withUserId
export default class RegisterDeveloper extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    createDeveloper: PropTypes.func,
    history: PropTypes.object,
    userId: PropTypes.string
  }

  state = {
    form: 'account',
    userId: ''
  }

  componentDidMount() {
    let { userId } = this.props
    if (userId) {
      this.setState({ form: 'info', userId })
    }
  }

  @autobind
  redirectToLogin() {
    let { history } = this.props
    history.push('/login')
  }

  getSectionMessage() {
    if (this.state.form === 'account') {
      return (
        <div>
          <p>Crea una cuenta de usuario o inicia sesión:</p>
          <Button onClick={this.redirectToLogin} primary>
            Login
          </Button>
        </div>
      )
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
