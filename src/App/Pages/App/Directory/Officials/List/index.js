import React from 'react'
import PaginatedList from 'App/components/Crud/List'

export default class ListDepartment extends React.Component {
  getFields() {
    return [
      {
        name: 'firstname',
        title: 'Nombre',
        sort: 'DESC',
        render: (value, doc, index) => <span>{value.firstname} </span>
      },
      {
        name: 'lastname',
        title: 'Apellido',
        sort: 'DESC',
        render: (value, doc, index) => <span>{value.lastname} </span>
      }
    ]
  }
  render() {
    return (
      <PaginatedList
        title='Funcionarios'
        name='officials'
        basePath='/directorio/funcionarios'
        fields={this.getFields()}
        canUpdate
        canCreate
      />
    )
  }
}
