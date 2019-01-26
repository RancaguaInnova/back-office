import React from 'react'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import styles from './styles.css'
import Loading from 'orionsoft-parts/lib/components/Loading'
import sleep from 'orionsoft-parts/lib/helpers/sleep'
import setSession from 'App/helpers/auth/setSession'

@withMutation(gql`
  mutation verifyEmail($token: String) {
    session: verifyEmail(token: $token) {
      _id
      userId
      publicKey
      secretKey
    }
  }
`)
export default class VerifyEmail extends React.Component {
  static propTypes = {
    verifyEmail: PropTypes.func,
    token: PropTypes.object,
    onLogin: PropTypes.func
  }

  state = {
    verified: false
  }

  componentDidMount() {
    this.verify()
  }

  @autobind
  async verify() {
    await sleep(2000)
    try {
      const {session} = await this.props.verifyEmail({
      const { session } = await this.props.verifyEmail({
        token: this.props.token
      })
      setSession(session)
      // this.props.onLogin()
      this.setState({ verified: true })
    } catch (error) {
      if (error.message.includes('Validation Error')) {
        this.setState({ errorMessage: 'El código de verificación expiró' })
      } else {
        this.setState({ errorMessage: error.message })
      }
    }
  }

  @autobind
  renderStatus() {
    if (!this.state.verified) {
      return (
        <div className={styles.loading}>
          <Loading size={40} />
          <p>Se esta verificando tu email</p>
        </div>
      )
    } else {
      return (
        <div className={styles.loading}>
          <p>Tu cuenta ha sido verificada!</p>
        </div>
      )
    }
  }

  render() {
    if (this.state.errorMessage) {
      return <div className={styles.error}>{this.state.errorMessage}</div>
    }
    return <div>{this.renderStatus()}</div>
  }
}
