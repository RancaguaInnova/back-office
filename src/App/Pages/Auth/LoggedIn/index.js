import React from 'react'
import styles from './styles.css'
import Button from 'orionsoft-parts/lib/components/Button'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import gql from 'graphql-tag'
import autobind from 'autobind-decorator'
import LogoutHelp from 'App/helpers/auth/logout'
@withRouter
@withMutation(gql`
  mutation logout($sessionId: ID!) {
    logout(sessionId: $sessionId)
  }
`)
export default class Logout extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    userId: PropTypes.string,
    logout: PropTypes.func
  }
  @autobind
  async logoutSession() {
    try {
      await this.props.logout({ sessionId: this.props.userId })
      await LogoutHelp()
      this.props.history.push('/login')
    } catch (error) {}
  }

  render() {
    return (
      <div className={styles.container}>
        <p>Ya tienes tu sesión iniciada, quieres cerrar tu sesión?</p>
        <Button onClick={() => this.props.history.push('/')}>Home</Button>
        <Button onClick={this.logoutSession} danger>
          Cerrar Sesión
        </Button>
      </div>
    )
  }
}
