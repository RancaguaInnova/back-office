import setSession from 'App/helpers/auth/setSession'
import autobind from 'autobind-decorator'
import gql from 'graphql-tag'
import sleep from 'orionsoft-parts/lib/helpers/sleep'
import PropTypes from 'prop-types'
import React from 'react'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import { Alert, Button, Col, Container, Row, Spinner } from 'react-bootstrap'

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
    token: PropTypes.string,
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
      const { session } = await this.props.verifyEmail({
        token: this.props.token
      })
      setSession(session)
      // this.props.onLogin()
      this.setState({ verified: true })
    } catch (error) {
      if (error.message.includes('Validation Error')) {
        this.setState({ errorMessage: 'Su cuenta ya a sido verificada' })
      } else {
        this.setState({ errorMessage: error.message })
      }
    }
  }

  @autobind
  renderStatus() {
    if (!this.state.verified) {
      return (
        <Container fluid>
          <Row>
            <Col className="text-center">
              <Button variant="primary" disabled>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                verificando tu email...
              </Button>{' '}
            </Col>
          </Row>
        </Container>
      )
    } else {
      return (
        <Container fluid>
          <Row>
            <Col className="text-center">
              <Alert variant={'info'}>
                <p>Tu cuenta ha sido verificada!</p>
              </Alert>
            </Col>
          </Row>
        </Container>
      )
    }
  }

  render() {
    if (this.state.errorMessage) {
      return (
        <Alert variant={'info'} className="text-center">
          <p>{this.state.errorMessage}</p>
        </Alert>
      )
    }
    return <div>{this.renderStatus()}</div>
  }
}
