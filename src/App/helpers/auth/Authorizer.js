import React from 'react'
import PropTypes from 'prop-types'
import withRoles from './withRoles'
import intersection from 'lodash/intersection'

export default function (ComposedComponent, allowedRoles) {
  @withRoles
  class Authorizer extends React.Component {
    static propTypes = {
      history: PropTypes.object,
      roles: PropTypes.arrayOf(PropTypes.string),
      allowedRoles: PropTypes.
    }

    render () {
      if (!intersection(allowedRoles, this.props.roles).length) return <NotAuthorized />
      return <ComposedComponent {...this.props} />
    }
  }

  return ForceLogin
}
