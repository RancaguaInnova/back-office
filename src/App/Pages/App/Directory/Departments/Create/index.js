import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'

@withRouter
@withMessage
class CreateDepartaments extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    showMessage: PropTypes.func,
    createApplication: PropTypes.func
  }
  state = {}

  onSuccess () {
    this.props.showMessage('departamento creado')
    this.props.history.push(`/directorio/departamentos`)
  }

  render () {
    return <div>Hola</div>
  }
}
export default CreateDepartaments
