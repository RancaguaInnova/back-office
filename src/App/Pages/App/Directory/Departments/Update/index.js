import React from 'react'
import Template from '../Template/'
import PropTypes from 'prop-types'

export default class UpdateDepartment extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    departmentId: PropTypes.string
  }
  render () {
    return (
      <Template
        type='update'
        departmentId={this.props.departmentId}
        title='Actualizar Departamento'
        description='Actualizando departamento'
        history={this.props.history}
      />
    )
  }
}
