import React from 'react'
import PaginatedList from 'App/components/Crud/List'
import moment from 'moment'
import { Button } from 'primereact/button'

export default class Events extends React.Component {
  getFields () {
    return [
      {
        name: 'date',
        title: 'Fecha',
        sort: 'desc',
        render: (value, doc, index) => (
          <span>
            {value && value.date ? moment(value.date).format('DD-MM-YYYY') : ''}{' '}
          </span>
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
      },
      {
        name: 'firebaseIdEvent',
        title: 'Detalle Tickets',
        render: (value, doc, index) => <span>{this.summaryButton(value)}</span>
      }
    ]
  }

  summaryButton (fields) {
    if (!fields.firebaseIdEvent) return 'Evento sin Tickets'
    return (
      <Button
        type='button'
        label='Detalle'
        onClick={() => this.renderSummaryModal()}
      />
    )
  }

  renderSummaryModal () {
    // Implement summary modal
    console.log('TESTING BUTTON:')
  }

  render () {
    return (
      <PaginatedList
        title='Eventos'
        name='events'
        basePath='/calendario/eventos'
        fields={this.getFields()}
        canCreate
        canUpdate
        allowSearch
        ignoreOnSelectColumns={['firebaseIdEvent']}
      />
    )
  }
}
