import React from 'react'
import Crud from 'App/components/Crud'

export default class Departments extends React.Component {
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
        path='/directorio/departamentos'
        singular='Departamento'
        plural='Departamentos'
        listQuery='departments'
        listFields={this.getFields()}
        itemQuery='department'
        updateMutation='updateDepartment'
        deleteMutation='deleteDepartment'
        relationsMap={{ managerId: 'officials' }}
        createMutation='createDepartment'
        allowSearch
      />
    )
  }
}
