import React from 'react'
import PropTypes from 'prop-types'
import Section from 'App/components/Section'
// import Button from 'orionsoft-parts/lib/components/Button'
import AutoForm from 'App/components/AutoForm'
import { Field } from 'simple-react-form'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import Textarea from 'orionsoft-parts/lib/components/fields/Textarea'
// import Toggle from 'orionsoft-parts/lib/components/fields/Toggle'
// import Select from 'orionsoft-parts/lib/components/fields/Select'
import Relation from 'App/components/fields/Relation'
import { withRouter } from 'react-router'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import styles from './styles.css'
import SearchBar from '../../../../../helpers/google/GooglePlaces/SearchBar'

@withRouter
@withMessage
class CreateDepartments extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    showMessage: PropTypes.func,
    createDepartment: PropTypes.func
  }

  state = {}

  onSuccess() {
    this.props.showMessage('Departamento creado')
    // this.props.history.push(`/directorio/departamento/`)
  }

  render() {
    return (
      <Section title='Crear Departamento' description='Crear un nuevo departamento' top>
        <AutoForm ref='form' mutation='createDepartment' onSuccess={this.onSuccess}>
          <div className={styles.headerLabel}>Información del departamento:</div>
          <div className={styles.fieldGroup}>
            <div className={styles.label}>Nombre</div>
            <Field fieldName='name' type={Text} />
            <div className={styles.label}>
              Texto que aparecerá en campos para seleccionar departamentos
            </div>
            <Field fieldName='description' type={Textarea} />
            <div className={styles.label}>Director(a) de este departamento</div>
            <Field
              fieldName='directorId'
              type={Relation}
              optionsQueryName='officials'
              onChange={value => this.setState({ directorId: value })}
              value={this.state.directorId || ''}
            />
            <div className={styles.label}>
              Area de servicio a la que pertenece este departamento
            </div>
            <Field
              fieldName='serviceAreaId'
              type={Relation}
              optionsQueryName='serviceAreas'
              onChange={value => this.setState({ serviceAreaId: value })}
              value={this.state.serviceAreaId || ''}
            />
          </div>
          <div className={styles.subheaderLabel}>INFORMACIÓN DE CONTACTO:</div>
          <div>
            <b>DIRECCIÓN</b>
          </div>
          <div className={styles.fieldGroup}>
            <SearchBar  />
          </div>
        </AutoForm>
      </Section>
    )
  }
}
export default CreateDepartments
