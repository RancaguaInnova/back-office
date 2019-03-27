import React from 'react'
import Template from '../Template/'
export default class UpdateDepartment extends React.Component {
  render() {
    return (
      <Template
        type='update'
        departmentId={this.props.departmentId}
        title='Actualizar Departamento'
        description='Actualizando departamento'
      />
    )
  }
}
