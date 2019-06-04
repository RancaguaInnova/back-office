import React, { Component } from 'react'
import Template from '../Template/'
import PropTypes from 'prop-types'

export default class CreateInformationCategory extends Component {
  static propTypes = {
    history: PropTypes.object,
    informationCategoryId: PropTypes.string,
    match: PropTypes.object
  }
  render() {
    return (
      <Template
        type='update'
        informationCategoryId={this.props.match.params.informationCategoryId}
        title='Actualizar categoría de Información'
        description='Permite actualizar  categorias existentes del modulo de información'
        history={this.props.history}
      />
    )
  }
}
