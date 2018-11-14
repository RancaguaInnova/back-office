import React from 'react'
import Crud from 'App/components/Crud'

export default class ServiceAreas extends React.Component {
  getFields () {
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
        path='/directorio/areas'
        singular='Area de Servicio'
        plural='Areas de Servicios'
        listQuery='serviceAreas'
        listFields={this.getFields()}
        itemQuery='servicearea'
        updateMutation='updateServiceArea'
        deleteMutation='deleteServiceArea'
        relationsMap={{ managerId: 'officials' }}
        createMutation='createServiceArea'
        allowSearch
      />
    )
  }
}
