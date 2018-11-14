import React from 'react'
import Crud from 'App/components/Crud'

export default class Events extends React.Component {
  getFields() {
    return [
      {
        name: 'name',
        title: 'Nombre',
        sort: 'DESC',
        render: (value, doc, index) => (<span>{value.name} </span>)
      }
    ]
  }

  render () {
    return (
      <Crud
        path='/calendario/eventos'
        singular='Evento'
        plural='Eventos'
        listQuery='events'
        listFields={this.getFields()}
        itemQuery='event'
        updateMutation='updateEvent'
        deleteMutation='deleteEvent'
        relationsMap={{ departmentId: 'departments' }}
        createMutation='createEvent'
        allowSearch
      />
    )
  }
}

