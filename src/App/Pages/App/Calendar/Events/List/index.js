import React from 'react'
import PaginatedList from 'App/components/Crud/List'
import moment from 'moment'

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
        name: 'date.dateStr',
        title: 'Fecha',
        render: (value, doc, index) => (
          <span>{moment(value.date.dateStr).format('DD-MM-YYYY')} </span>
        )
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
