import React from 'react'
import PaginatedList from 'App/components/Crud/List'

export default class ListApplications extends React.Component {
  getFields() {
    return [
      {
        name: 'name',
        title: 'Nombre',
        sort: 'DESC',
        render: (value, doc, index) => <span>{value.name} </span>
      }
    ]
  }
  render() {
    return (
      <PaginatedList
        title='Aplicaciones'
        name='applications'
        basePath='/devs/apps'
        fields={this.getFields()}
        canUpdate
        canCreate
      />
    )
  }
}
