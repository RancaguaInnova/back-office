import React from 'react'
import styles from './styles.css'
import Button from 'orionsoft-parts/lib/components/Button'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import gql from 'graphql-tag'

@withRouter
@withMutation(gql`
  mutation logout($_id: ID!) {
    logout(_id: $_id)
  }
`)
export default class Logout extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    userId: PropTypes.string,
    logout: PropTypes.func
  }

  async logout() {
    await this.props.logout({ _id: this.props.userId })
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
