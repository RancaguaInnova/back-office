import React from 'react'
import PaginatedList from 'App/components/Crud/List'

export default class ListDepartment extends React.Component {
  getFields() {
    return [
      {
        name: 'name',
        title: 'Nombre',
        sort: 'DESC',
        render: (value, doc, index) => <span>{value.name} </span>
      },
      {
        name: 'optionLabel',
        title: 'Description',
        sort: 'DESC',
        render: (value, doc, index) => <span>{value.optionLabel} </span>
      }
    ]
  }
  render() {
    return (
      <PaginatedList
        title='Departamentos Municipales'
        name='departments'
        basePath='/directorio/departamentosMunicipales'
        fields={this.getFields()}
        canUpdate
        canCreate
      />
    )
  }
}
