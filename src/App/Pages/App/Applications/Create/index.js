import React from 'react'
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
import PropTypes from 'prop-types'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import gql from 'graphql-tag'
import autobind from 'autobind-decorator'
import styles from './styles.css'

@withRouter
@withMessage
@withMutation(gql`
  mutation createApplication($application: ApplicationInput!) {
    createApplication(application: $application) {
      _id
    }
  }
`)
export default class CreateApplication extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    showMessage: PropTypes.func,
    createApplication: PropTypes.func
  }

  state = {}

  onSuccess() {
    this.props.showMessage('Aplicación creada')
    this.props.history.push(`/apps`)
  }

  @autobind
  async onSubmit() {
    try {
      await this.props.createApplication({ application: this.state })
      this.onSuccess()
    } catch (error) {
      this.props.showMessage('Ocurrió un error al intentar crear la aplicación')
      console.log('Error creating application:', error)
    }
  }

  render() {
    return (
      <Section
        title="Crear Aplicación"
        description="Crear una nueva integración"
        top
      >
        <AutoForm
          mutation="createApplication"
          onSuccess={this.onSuccess}
          ref="form"
        >
          <div className={styles.headerLabel}>
            Información de la aplicación:
          </div>
          <div className={styles.fieldGroup}>
            <div className={styles.label}>Nombre:</div>
            <Field fieldName="name" type={Text} />
            <div className={styles.label}>Descripción:</div>
            <Field fieldName="description" type={Textarea} />
            <div className={styles.label}>URL de redirección:</div>
            <Field fieldName="applicationURL" type={Text} />
            <div className={styles.label}>Departamento al cual pertenece:</div>
            <Field
              fieldName="departmentId"
              type={Relation}
              optionsQueryName="departments"
              onChange={value => this.setState({ departmentId: value })}
              value={this.state.departmentId || ''}
            />
            <div className={styles.label}>Datos de usuario:</div>
            <Field
              fieldName="userFields"
              type={Select}
              multi
              options={[
                {
                  label: 'Rut',
                  value: 'identifier'
                },
                {
                  label: 'Nombre',
                  value: 'firstName'
                },
                {
                  label: 'Apellido',
                  value: 'lastName'
                },
                {
                  label: 'Dirección',
                  value: 'address'
                },
                {
                  label: 'Teléfono',
                  value: 'phone'
                },
                {
                  label: 'Nivel Educacional',
                  value: 'educationalLevel'
                }
              ]}
            />
          </div>
          <div className={styles.headerLabel}>
            Información del desarrollador:
          </div>
          <div className={styles.fieldGroup}>
            <div className={styles.label}>Nombre:</div>
            <Field fieldName="developerInfo.firstName" type={Text} />
            <div className={styles.label}>Apellido:</div>
            <Field fieldName="developerInfo.lastName" type={Text} />
            <div className={styles.label}>Pagina Web:</div>
            <Field fieldName="developerInfo.url" type={Text} />
            <div className={styles.headerLabel}>Información de contacto:</div>
            <div className={styles.fieldGroup}>
              <div className={styles.subheaderLabel}>Dirección:</div>
              <div className={styles.fieldGroup}>
                <div className={styles.label}>Nombre de calle:</div>
                <Field
                  fieldName="developerInfo.contactInformation.address.streetName"
                  type={Text}
                />
                <div className={styles.label}>Numeración:</div>
                <Field
                  fieldName="developerInfo.contactInformation.address.streetNumber"
                  type={Text}
                />
                <div className={styles.label}>
                  Número de oficina/casa/departamento (opcional):
                </div>
                <Field
                  fieldName="developerInfo.contactInformation.address.departmentNumber"
                  type={Text}
                />
                <div className={styles.label}>Ciudad:</div>
                <Field
                  fieldName="developerInfo.contactInformation.address.city"
                  type={Text}
                />
                <div className={styles.label}>Código Postal:</div>
                <Field
                  fieldName="developerInfo.contactInformation.address.postalCode"
                  type={Text}
                />
              </div>
              <div className={styles.subheaderLabel}>Teléfono:</div>
              <div className={styles.fieldGroup}>
                <div className={styles.label}>Código de área:</div>
                <Field
                  fieldName="developerInfo.contactInformation.phone.areaCode"
                  type={Text}
                />
                <div className={styles.label}>Número fijo:</div>
                <Field
                  fieldName="developerInfo.contactInformation.phone.number"
                  type={Text}
                />
                <div className={styles.label}>Celular:</div>
                <Field
                  fieldName="developerInfo.contactInformation.phone.mobilePhone"
                  type={Text}
                />
              </div>
            </div>
            <div className={styles.headerLabel}>Aplicación Aprobada:</div>
            <div className={styles.fieldGroup}>
              <Field fieldName="approved" type={Toggle} />
            </div>
          </div>
        </AutoForm>
        <br />
        <Button to="/apps/lista" style={{ marginRight: 10 }}>
          Cancelar
        </Button>
        <Button onClick={this.onSubmit} primary>
          Crear Aplicación
        </Button>
      </Section>
    )
  }
}
