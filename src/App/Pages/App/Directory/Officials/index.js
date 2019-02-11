import React from 'react'
import Crud from 'App/components/Crud'

export default class Officials extends React.Component {
  getFields () {
    return [
      {
        name: 'firstname',
        title: 'Nombre',
        sort: 'DESC',
        render: (value, doc, index) => <span>{value.firstname} </span>
      },
      {
        name: 'lastname',
        title: 'Apellido',
        sort: 'DESC',
        render: (value, doc, index) => <span>{value.lastname} </span>
      }
    ]
  }

  render () {
    return (
      <Crud
        path='/directorio/funcionarios'
        singular='Funcionario'
        plural='Funcionarios'
        listQuery='officials'
        listFields={this.getFields()}
        itemQuery='official'
        updateMutation='updateOfficial'
        deleteMutation='deleteOfficial'
        createMutation='createOfficial'
        allowSearch
      />
    )
  }
}
