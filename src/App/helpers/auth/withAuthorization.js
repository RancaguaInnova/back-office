import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import withRoles from './withRoles'
import intersection from 'lodash/intersection'

export default function (allowedRoles) {
  return function (ComposedComponent) {
    @withRoles
    @withRouter
    class Authorizer extends React.Component {
      static propTypes = {
        roles: PropTypes.arrayOf(PropTypes.string),
        history: PropTypes.object
      }

      redirect () {
        this.props.history.replace({
          pathname: '/no-autorizado',
          state: { nextPathname: window.location.pathname }
        })
        return null
      }

      isAuthorized () {
        if (intersection(allowedRoles, this.props.roles).length) return true
        return false
      }

      render () {
        if (this.isAuthorized()) return <ComposedComponent {...this.props} />
        return this.redirect()
      }
    }

    return Authorizer
  }
}
