import React from 'react'
import Crud from 'App/components/Crud'

export default class Areas extends React.Component {
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
        path='/areas/lista'
        singular='Area'
        plural='Areas'
        listQuery='serviceAreas'
        listFields={this.getFields()}
        itemQuery='servicearea'
        updateMutation='updateServiceArea'
        deleteMutation='deleteServiceArea'
        createMutation='createServiceArea'
        allowSearch
      />
    )
  }
}
