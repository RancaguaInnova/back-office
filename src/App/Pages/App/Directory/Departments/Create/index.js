import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Section from 'App/components/Section'
import { Field, Form } from 'simple-react-form'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import Textarea from 'orionsoft-parts/lib/components/fields/Textarea'
import Relation from 'App/components/fields/Relation'
import { withRouter } from 'react-router'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import styles from './styles.css'
import SearchBar from 'App/components/fields/google/GooglePlaces'
import Button from 'orionsoft-parts/lib/components/Button'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import gql from 'graphql-tag'
import autobind from 'autobind-decorator'
import FormValidator from 'App/components/validation/FormValidator'

@withRouter
@withMessage
@withMutation(gql`
  mutation createDepartment($department: CreateDepartmentInput!) {
    createDepartment(department: $department) {
      _id
    }
  }
`)
class CreateDepartments extends React.Component {
  constructor() {
    super()

    this.validator = new FormValidator([
      {
        field: 'name',
        method: 'isEmpty',
        validWhen: false,
        message: 'El nombre es requerido',
      },

      {
        field: 'contactInformation_email',
        method: 'isEmail',
        validWhen: true,
        message: 'Debe Ingresar un email válido.',
        require_tld: false,
        require_display_name: false
      },
    ])

    this.state = {
      name: '',
      contactInformation_email:'',

      validation: this.validator.valid(),
    }

    this.submitted = false
  }
  static propTypes = {
    history: PropTypes.object,
    showMessage: PropTypes.func,
    createDepartment: PropTypes.func,
  }

  state = {}

  onSuccess() {
    this.props.showMessage('Departamento creado')
    this.props.history.push(`/directorio/departamento/`)
  }

  @autobind
  async onSubmit() {
    try {
      console.log(this.state)
      await this.props.createDepartment({ department: this.state.department })
      this.onSuccess()
    } catch (error) {
      this.props.showMessage('Ocurrió un error al editar la aplicación: Complete todos los campos')
      console.log('Error creating application:', error)
    }
  }

  handleChangeAddress = contactInformationAddress => {
    this.setState({
      contactInformation: {
        address: contactInformationAddress,
      },
    })
  }
  handleInputChange = event => {
    event.preventDefault();

    this.setState({
      [event.target.name]: event.target.value
    })
    this.setState({
      department:{[event.target.name]: event.target.value },
  })
}

  handleInputEmail = event => {
    event.preventDefault()

    this.setState({
      [event.target.name]: event.target.value
    })
    this.setState({
      department:{contactInformation: {
        email:  event.target.value,
      }
    },
    })
  }

  handleFormSubmit = event => {
    event.preventDefault()
    console.log(this.state)

    const validation = this.validator.validate(this.state)
    this.setState({ validation })
    this.submitted = true

    console.log(validation.isValid)

    if (validation.isValid) {
      // handle actual form submission here
      this.onSubmit()
    }
  }
  render() {
    let validation = this.submitted // if the form has been submitted at least once
      ? this.validator.validate(this.state) // then check validity every time we render
      : this.state.validation // otherwise just use what's in state
    return (
      <Section title='Crear Departamento' description='Crear un nuevo departamento' top>
        <Form
          state={this.state.department}
          onChange={changes => {
            console.log(changes)
            this.setState({ department: changes })

          }}
        >
          <div className={styles.headerLabel}>Información del departamento:</div>
          <div className={styles.fieldGroup}>
            <div className={styles.label}>Nombre</div>

            <Field fieldName='name' type={Text} />
            <span className="help-block">{validation.name.message}</span>

            <div className={styles.label}>
              Texto que aparecerá en campos para seleccionar departamentos
            </div>
            <Field fieldName='optionLabel' type={Textarea} />
            <div className={styles.label}>Director(a) de este departamento</div>
            <Field fieldName='managerId' type={Relation} optionsQueryName='officials' />
            <div className={styles.label}>
              Area de servicio a la que pertenece este departamento
            </div>
            <Field fieldName='serviceAreaId' type={Relation} optionsQueryName='serviceAreas' />
          </div>
          <div className={styles.subheaderLabel}>INFORMACIÓN DE CONTACTO:</div>
          <div>
            <b>DIRECCIÓN</b>
          </div>
          <div className={styles.fieldGroup}>
            <SearchBar handleChangeAddress={this.handleChangeAddress} />
          </div>
          <div>
            <b>TELÉFONO</b>
          </div>
          <div className={styles.fieldGroup}>
            <div className={styles.label}>Código de área</div>
            <Field fieldName='contactInformation.phone.areaCode' type={Text} />

            <div className={styles.label}>Número</div>
            <Field fieldName='contactInformation_phone_number' type={Text} />

            <div className={styles.label}>Celular</div>
            <Field fieldName='contactInformation.phone.mobilePhone' type={Text} />

            <div className="os-input-container">
            <input type="text" className="os-input-text"
            name="contactInformation_email"
            placeholder=""
            onChange={this.handleInputEmail}
          /></div>
            <span className="help-block">{validation.contactInformation_email.message}</span>

            <div className={styles.label}>Email</div>
            <Field fieldName='contactInformation_email' type={Text} />


            <div className={styles.label}>
              Horarios de atención (Ej: lunes a jueves / 08:30 a 13:30 / Viernes 08:30 a 16:30)
            </div>
            <Field fieldName='businessHours' type={Text} />

            <div className={styles.label}>Descripción de funciones del departamento</div>
            <Field fieldName='description' type={Text} />

            <div className={styles.label}>
              Imagen del edificio donde se encuentra el departamento
            </div>
            <Field fieldName='imageUrl' type={Text} />

            <div className={styles.label}>Dirección del departamento de tránsito</div>
            <Field fieldName='address' type={Text} />
          </div>
        </Form>
        <br />
        <Button to='/apps/lista' style={{ marginRight: 10 }}>
          Cancelar
        </Button>
        <button onClick={this.handleFormSubmit} className='orion_button '>
          Crear Departamento
        </button>
      </Section>
    )
  }
}
export default CreateDepartments
