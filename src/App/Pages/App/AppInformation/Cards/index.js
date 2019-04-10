import React from 'react'
import Crud from 'App/components/Crud'

export default class Cards extends React.Component {
  getFields () {
    return [
      {
        name: 'name',
        title: 'Nombre',
        sort: 'DESC',
        render: (value, doc, index) => <span>{value.name} </span>
      },
      {
        name: 'title',
        title: 'Título',
        render: (value, doc, index) => <span>{value.title} </span>
      },
      {
        name: 'title',
        title: 'Título',
        render: (value, doc, index) => <span>{value.title} </span>
      }
    ]
  }

  render () {
    return (
      <Crud
        path='/informacion/tarjetas'
        singular='Tarjeta'
        plural='Tarjetas'
        listQuery='cards'
        listFields={this.getFields()}
        itemQuery='card'
        updateMutation='updateCard'
        deleteMutation='deleteCard'
        createMutation='createCard'
        allowSearch
      />
    )
  }
}
