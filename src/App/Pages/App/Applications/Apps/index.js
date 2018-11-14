import React from 'react'
import Crud from 'App/components/Crud'

export default class Apps extends React.Component {
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
        path='/apps/lista'
        singular='Aplicación'
        plural='Aplicaciones'
        listQuery='applications'
        listFields={this.getFields()}
        itemQuery='application'
        updateMutation='updateApplication'
        deleteMutation='deleteApplication'
        createMutation='createApplication'
        allowSearch
      />
    )
  }
}
