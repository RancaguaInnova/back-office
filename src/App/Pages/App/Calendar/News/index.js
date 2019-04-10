import React from 'react'
import Crud from 'App/components/Crud'
import formatDate from 'App/helpers/format/formatDate'

export default class Events extends React.Component {
  getFields () {
    return [
      {
        name: 'date',
        title: 'Fecha publicación',
        sort: 'DESC',
        render: (value, doc, index) => <span>{formatDate(value.date)} </span>
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
        path='/calendario/noticias'
        singular='Noticia'
        plural='Noticias'
        listQuery='news'
        listFields={this.getFields()}
        itemQuery='new'
        updateMutation='updateNews'
        deleteMutation='deleteNews'
        relationsMap={{ departmentId: 'departments' }}
        createMutation='createNews'
        allowSearch
      />
    )
  }
}
