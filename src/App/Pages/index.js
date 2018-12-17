import React from 'react'
import authRouteRegex from './Auth/routeRegex'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import Auth from './Auth'
import App from './App'

@withRouter
export default class Pages extends React.Component {
  static propTypes = {
    location: PropTypes.object
  }

  render() {
    if (authRouteRegex.test(this.props.location.pathname)) {
      return <Auth />
    }
    return <App />
  }
}
