import React from 'react'
import PaginatedList from 'App/components/Crud/List'

export default class Applications extends React.Component {
  getFields () {
    return [
      {
        name: 'name',
        title: 'Nombre',
        sort: 'DESC',
        render: (value, doc, index) => <span>{value.name} </span>
      },
      {
        name: 'description',
        title: 'Description',
        sort: 'DESC',
        render: (value, doc, index) => <span>{value.description} </span>
      }
    ]
  }

  render () {
    return (
      <PaginatedList
        title='Aplicaciones'
        name='applications'
        basePath='/apps'
        fields={this.getFields()}
        canCreate
        canUpdate
        allowSearch
      />
    )
  }
}
