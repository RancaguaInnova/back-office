import autobind from 'autobind-decorator'
import PropTypes from 'prop-types'
import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { Route, Switch, withRouter } from 'react-router-dom'

import Enroll from './Enroll'
import Forgot from './Forgot'
import Login from './Login'
import Logo from './Logo'
import Register from './Register'
import Reset from './Reset'
import styles from './styles.css'
import VerifyEmail from './VerifyEmail'

@withRouter
export default class Auth extends React.Component {
  state = { isLoading: false, error: null }

  static propTypes = {
    children: PropTypes.any,
    location: PropTypes.object,
    history: PropTypes.object,
    match: PropTypes.object,
    params: PropTypes.object
  }

  @autobind
  onLogin() {
    const { location } = this.props
    if (location.state && location.state.nextPathname) {
      this.props.history.replace(location.state.nextPathname)
    } else {
      this.props.history.goBack()
    }
  }

  renderLogo() {
    return (
      <Container>
        <Row>
          <Col>
            <Logo color="black" isLoading={this.state.isLoading} />
          </Col>
        </Row>
      </Container>
    )
  }

  render() {
    const otherProps = { onLogin: this.onLogin }
    const WEB = 'https://rancagua.cl'
    const LINK = 'rancaguadigital'

    return (
      <div className="">
        <div>
          <Container className="contenedordata">
            <Row>
              <Col>{this.renderLogo()}</Col>
            </Row>
            <Row>
              <Col className="midle d-flex justify-content-center">
                <Switch>
                  <Route
                    path="/login"
                    render={() => <Login {...otherProps} />}
                  />
                  <Route
                    path="/register"
                    render={() => <Register {...otherProps} />}
                  />
                  <Route
                    path="/verify-email/:token"
                    render={({ match }) => (
                      <VerifyEmail token={match.params.token} {...otherProps} />
                    )}
                  />
                  <Route
                    path="/forgot"
                    render={() => <Forgot {...otherProps} />}
                  />
                  <Route
                    path="/reset/:token"
                    render={({ match }) => (
                      <Reset token={match.params.token} {...otherProps} />
                    )}
                  />
                  <Route
                    path="/enroll/:token"
                    render={({ match }) => (
                      <Enroll token={match.params.token} {...otherProps} />
                    )}
                  />
                </Switch>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className={styles.photo} />
              </Col>
            </Row>
          </Container>
        </div>
        <footer>
          <Container>
            <Row>
              <Col className="text-center p-2">
                <a href="mailto:contacto@smart.rancagua.cl">
                  &copy; desarrollo e innovación
                </a>
              </Col>
            </Row>
          </Container>
        </footer>
      </div>
    )
  }
}
