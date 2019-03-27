import React from 'react'
import Template from '../Template/'
export default class CreateDepartments extends React.Component {
  render() {
    return (
      <Template
        type='create'
        departmentId=''
        title='Crear Departamento'
        description='Creación de nuevo departamento'
      />
    )
  }
}
