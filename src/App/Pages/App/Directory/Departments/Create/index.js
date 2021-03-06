import React from 'react'
import Template from '../Template/'
import PropTypes from 'prop-types'
export default class CreateDepartments extends React.Component {
  static propTypes = {
    history: PropTypes.object
  }
  render() {
    return (
      <Template
        type='create'
        departmentId=''
        title='Crear Departamento Municipal'
        description='Creación de nuevo departamento municipal'
        history={this.props.history}
      />
    )
  }
}
