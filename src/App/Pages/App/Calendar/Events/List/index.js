import React from 'react'
import PaginatedList from 'App/components/Crud/List'

export default class Events extends React.Component {
  getFields() {
    return [
      {
        name: 'name',
        title: 'Nombre',
        sort: 'DESC',
        render: (value, doc, index) => <span>{value.name} </span>
      },
      {
        name: 'externalUrl',
        title: 'Link',
        sort: 'DESC',
        render: (value, doc, index) => <span>{value.externalUrl} </span>
      }
    ]
  }

  render() {
    return (
      <PaginatedList
        title='Eventos'
        name='events'
        basePath='/calendario/eventos'
        fields={this.getFields()}
        canCreate
        canUpdate
        allowSearch
      />
    )
  }
}
