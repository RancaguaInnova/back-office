import React from 'react'
import styles from './styles.css'
import Button from 'orionsoft-parts/lib/components/Button'
import logout from 'App/helpers/auth/logout'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'

@withRouter
export default class Logout extends React.Component {
  static propTypes = {
    history: PropTypes.object
  }

  async logout() {
    await logout()
  }

  render() {
    return (
      <div className={styles.container}>
        <p>Ya tienes tu sesión iniciada, quieres cerrar tu sesión?</p>
        <Button onClick={() => this.props.history.push('/')}>Home</Button>
        <Button onClick={this.logout} danger>
          Cerrar Sesión
        </Button>
      </div>
    )
  }
}
