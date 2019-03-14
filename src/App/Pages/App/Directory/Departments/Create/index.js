import React from 'react'
import PropTypes from 'prop-types'
import Section from 'App/components/Section'
import Button from 'orionsoft-parts/lib/components/Button'
import AutoForm from 'App/components/AutoForm'
import { Field } from 'simple-react-form'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import Textarea from 'orionsoft-parts/lib/components/fields/Textarea'
import Toggle from 'orionsoft-parts/lib/components/fields/Toggle'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import Relation from 'App/components/fields/Relation'
import { withRouter } from 'react-router'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import styles from './styles.css'

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
