import React from 'react'
import PaginatedList from 'App/components/Crud/List'
import moment from 'moment'

export default class Events extends React.Component {
  getFields() {
    return [
      {
        name: 'date',
        title: 'Fecha',
        sort: 'desc',
        render: (value, doc, index) => (
          <span>{value.date ? moment(value.date).format('DD-MM-YYYY') : ''} </span>
        )
      },
      {
        name: 'name',
        title: 'Nombre',
        render: (value, doc, index) => <span>{value.name} </span>
      },

      {
        name: 'externalUrl',
        title: 'Link',
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
