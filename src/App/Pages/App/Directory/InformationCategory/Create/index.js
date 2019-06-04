import React, { Component } from 'react'
import Template from '../Template/'
import PropTypes from 'prop-types'

export default class CreateInformationCategory extends Component {
  static propTypes = {
    history: PropTypes.object
  }
  render() {
    return (
      <Template
        type='create'
        informationCategoryId=''
        title='Crear Categoria de Información'
        description='Permite crear nuevas categorias del modulo de información'
        history={this.props.history}
      />
    )
  }
}
