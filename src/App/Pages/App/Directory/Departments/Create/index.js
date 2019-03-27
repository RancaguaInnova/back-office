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
        title='Crear Departamento'
        description='Creación de nuevo departamento'
        history={this.props.history}
      />
    )
  }
}
