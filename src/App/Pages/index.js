import React from 'react'
import authRouteRegex from './Auth/routeRegex'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import DynamicComponent from 'App/components/DynamicComponent'
import App from './App'

@withRouter
export default class Pages extends React.Component {
  static propTypes = {
    location: PropTypes.object
  }

  render() {
    if (authRouteRegex.test(this.props.location.pathname)) {
      return DynamicComponent(() => import('./Auth'))
    }
    return <App />
  }
}
