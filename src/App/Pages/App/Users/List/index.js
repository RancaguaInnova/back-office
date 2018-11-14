import React from 'react'
import PaginatedList from 'App/components/Crud/List'

export default class ListUsers extends React.Component {
  getFields () {
    return [
      {
        name: 'name',
        title: 'Nombre',
        sort: 'DESC',
        render: (value, doc, index) => (<span>{value.name} </span>)
      },
      {
        name: 'lastName',
        title: 'Apellido',
        sort: 'DESC',
        render: (value, doc, index) => (<span>{value.lastName} </span>)
      },
      {
        name: 'identifier',
        title: 'RUT',
        sort: 'DESC',
        render: (value, doc, index) => (<span>{value.identifier} </span>)
      }
    ]
  }

  render () {
    return (
      <PaginatedList
        title='Usuarios'
        name='users'
        basePath={this.getBasePath()}
        fields={this.getFields()}
        canCreate
        canUpdate
        allowSearch
      />
    )
  }
}
