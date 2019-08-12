import React, { Component } from 'react'
import Template from '../Template'
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
        officialId={this.props.match.params.officialId}
        title='Actualiza el registro del funcionario '
        description=''
        history={this.props.history}
      />
    )
  }
}
