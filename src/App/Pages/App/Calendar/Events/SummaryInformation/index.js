import React, { Component } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import PropTypes from 'prop-types'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import './style.css'

@withGraphQL(gql`
  query eventSummary($firebaseIdEvent: String!) {
    eventSummary(firebaseIdEvent: $firebaseIdEvent) {
      eventId
      locationName
      updatedAt {
        _seconds
      }
      active
      quota
      reservation {
        count
      }
      checkIn {
        count
      }
    }
  }
`)
export default class SummaryInformation extends Component {
  static propTypes = {
    eventSummary: PropTypes.array
  }
  constructor(props) {
    super(props)
    let dataTableArray = []
    dataTableArray = this.props.eventSummary.map(summary => {
      let objectReturn = {
        locationName: summary.locationName,
        quota: summary.quota,
        available: summary.quota - summary.reservation.count,
        reservation: summary.reservation.count,
        checkIn: summary.checkIn.count
      }
      return objectReturn
    })
    this.state = {
      open: false,
      dataTableArray: dataTableArray
    }
    this.resheshPage = this.resheshPage.bind(this)
  }
  resheshPage() {
    this.forceUpdate()
  }

  render() {
    let paginatorLeft = <Button icon='pi pi-refresh' onClick={this.resheshPage} />
    return (
      <div>
        <div className='content-section'>Resumen del evento</div>

        <div className='implementation'>
          <DataTable
            value={this.state.dataTableArray}
            paginator={true}
            rows={10}
            paginatorLeft={paginatorLeft}
            emptyMessage='No se encontro información de locaciones'
          >
            <Column field='locationName' header='Locación' />
            <Column field='quota' header='Asignados' />
            <Column field='available' header='Disponibles' />
            <Column field='reservation' header='Reservados' />
            <Column field='checkIn' header='Validados' />
          </DataTable>
        </div>
      </div>
    )
  }
}
