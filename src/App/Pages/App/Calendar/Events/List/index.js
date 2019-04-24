import React from 'react'
import PaginatedList from 'App/components/Crud/List'
import moment from 'moment'
import { Button } from 'primereact/button'
import Popup from 'reactjs-popup'
import SummaryInformation from '../SummaryInformation'

export default class Events extends React.Component {
  constructor(props) {
    super(props)
    this.state = { open: false, eventSelect: '' }
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }
  openModal() {
    this.setState({ open: true })
  }
  closeModal() {
    this.setState({ open: false })
  }

  getFields() {
    return [
      {
        name: 'date',
        title: 'Fecha',
        sort: 'desc',
        render: (value, doc, index) => (
          <span>{value && value.date ? moment(value.date).format('DD-MM-YYYY') : ''} </span>
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

  summaryButton(fields) {
    if (!fields.firebaseIdEvent) return 'Evento sin Tickets'
    return (
      <Button
        type='button'
        label='Detalle'
        onClick={() => this.renderSummaryModal(fields.firebaseIdEvent)}
      />
    )
  }

  async renderSummaryModal(firebaseIdEvent) {
    await this.setState({ eventSelect: firebaseIdEvent })
    this.openModal()
  }

  render() {
    return (
      <div>
        <div>
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
        </div>
        <div>
          <Popup open={this.state.open} closeOnDocumentClick onClose={this.closeModal}>
            <div className='modal'>
              <a className='close' onClick={this.closeModal}>
                <i className='pi pi-times' />
              </a>
              <SummaryInformation firebaseIdEvent={this.state.eventSelect} />
            </div>
          </Popup>
        </div>
      </div>
    )
  }
}
