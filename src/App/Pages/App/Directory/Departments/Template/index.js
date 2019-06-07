import React from 'react'
import PropTypes from 'prop-types'
import Section from 'App/components/Section'
import { withRouter } from 'react-router'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import SearchBar from 'App/components/fields/GooglePlaces'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import gql from 'graphql-tag'
import autobind from 'autobind-decorator'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import DepartmentFragments from 'App/fragments/Department'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import _mergeWith from 'lodash/mergeWith'
import { Button } from 'primereact/button'
import './styles.css'
import FileUploader from 'react-firebase-file-uploader'
import { ProgressSpinner } from 'primereact/progressspinner'
import firebase from '/src/App/helpers/auth/firebaseConfig'
import { Chips } from 'primereact/chips'

@withRouter
@withMessage
@withMutation(gql`
  mutation createDepartment($department: DepartmentInput!) {
    createDepartment(department: $department) {
      _id
    }
  }
`)
@withMutation(gql`
  mutation updateDepartment($department: DepartmentInput!) {
    updateDepartment(department: $department) {
      _id
    }
  }
`)
@withMutation(gql`
  mutation deleteDepartment($_id: ID!) {
    deleteDepartment(_id: $_id)
  }
`)
@withGraphQL(gql`
  query department($departmentId: ID!) {
    department(departmentId: $departmentId) {
      ...FullDepartment
    }
    officials {
      items {
        value: _id
        label: optionLabel
      }
    }
    informationCategoriesList {
      value: _id
      label: name
    }
  }
  ${DepartmentFragments.FullDepartment}
`)
class TemplateDepartment extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    showMessage: PropTypes.func,
    createDepartment: PropTypes.func,
    department: PropTypes.object,
    updateDepartment: PropTypes.func,
    deleteDepartment: PropTypes.func,
    officials: PropTypes.object,
    informationCategoriesList: PropTypes.array,
    type: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string
  }
  constructor(props) {
    super(props)
    var department = {
      _id: '',
      name: '',
      optionLabel: '',
      managerId: '',
      serviceAreaId: '',
      businessHours: '',
      description: '',
      imageUrl: '',
      address: '',
      tags: [],
      contactInformation: {
        phone: {
          areaCode: null,
          number: null,
          mobilePhone: null
        },
        address: {
          streetName: '',
          streetNumber: '',
          departmentNumber: '',
          city: '',
          postalCode: '',
          administrativeAreaLevel1: '',
          administrativeAreaLevel2: '',
          country: '',
          formatted_address: '',
          place_id: '',
          latitude: null,
          longitude: null
        },
        email: ''
      }
    }
    this.state = {
      department: department,
      officialsArray: this.props.officials.items,
      informationCategoriesList: this.props.informationCategoriesList
    }
  }
  componentDidMount() {
    if (this.props.type === 'update') {
      var department = _mergeWith(this.state.department, this.props.department, (a, b) =>
        b === null ? a : undefined
      )
      this.setState(department)
    }
  }
  onSuccessInsert() {
    this.props.showMessage('Departamento creado')
    this.props.history.push(`/directorio/departamentos/`)
  }
  onSuccessUpdate() {
    this.props.showMessage('Departamento actualizado correctamente')
    this.props.history.push(`/directorio/departamentos/`)
  }
  @autobind
  BackList() {
    this.props.history.push(`/directorio/departamentos/`)
  }

  @autobind
  onSuccessDelete() {
    this.props.showMessage('Departamento eliminado correctamente')
    this.props.history.push(`/directorio/departamentos/`)
  }

  @autobind
  async onDelete() {
    try {
      var department = this.state.departament
      await this.props.deleteDepartment({ _id: department._id })
      this.onSuccessDelete()
    } catch (error) {
      this.props.showMessage('Ocurrió un error al eliminar el departamento')
    }
  }

  handleChangeAddress = contactInformationAddress => {
    let department = { ...this.state.department }

    department.contactInformation.address = _mergeWith(
      department.contactInformation.address,
      contactInformationAddress,
      (a, b) => (b === null ? a : undefined)
    )
    this.setState({ department })
  }

  toggleValidating(validate) {
    this.setState({ validate })
  }

  handleUploadStart = () => this.setState({ isUploading: true, progress: 0 })
  handleProgress = progress => this.setState({ progress })
  handleUploadError = () => {
    this.setState({ isUploading: false })
  }
  handleUploadSuccess = filename => {
    this.setState({
      uploadImageUrl: filename,
      progress: 100,
      isUploading: false
    })
    firebase
      .storage()
      .ref('DepartmentImages')
      .child(filename)
      .getDownloadURL()
      .then(url => {
        let department = { ...this.state.department }
        department.imageUrl = url
        this.setState({ department })
      })
  }
  handleUploadImage() {
    return (
      <span className='p-button p-fileupload-choose p-component p-button-text-icon-left p-button-success'>
        <span className='p-button-icon-center pi pi-plus m6' />
        <FileUploader
          accept='image/*'
          name='uploadImageUrl'
          className='p-inputtext p-component p-inputtext p-filled'
          randomizeFilename
          storageRef={firebase.storage().ref('DepartmentImages')}
          onUploadStart={this.handleUploadStart}
          onUploadError={this.handleUploadError}
          onUploadSuccess={this.handleUploadSuccess}
          onProgress={this.handleProgress}
        />
      </span>
    )
  }
  handleSpinner() {
    return <ProgressSpinner style={{ width: '30px', height: '30px' }} />
  }
  @autobind
  confirmDelete() {
    confirmAlert({
      title: 'Confirmar acción',
      message: '¿seguro desea eliminar este Departamento?',
      buttons: [
        {
          label: 'Sí',
          onClick: async () => await this.onDelete()
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    })
  }

  @autobind
  async handleSubmit(e) {
    e.preventDefault()
    var department = this.state.department
    console.log(department)
    if (this.props.type === 'create') {
      try {
        await this.props.createDepartment({ department: department })
        this.onSuccessInsert()
      } catch (error) {
        console.log(error)
        this.props.showMessage('Ocurrión un error!')
      }
    } else {
      try {
        await this.props.updateDepartment({ department: department })
        this.onSuccessUpdate()
      } catch (error) {
        console.log(error)
        this.props.showMessage('Ocurrión un error!')
      }
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Section title={this.props.title} description={this.props.description} top>
          <div className='fieldGroup'>
            <div className='label'>Nombre</div>
            <InputText
              value={this.state.department.name}
              onChange={e => {
                let department = { ...this.state.department }
                department.name = e.target.value
                this.setState({ department })
              }}
              className='p-inputtext'
              required
              tabIndex={1}
            />

            <div className='label'>
              Texto que aparecerá en campos para seleccionar departamentos
            </div>
            <InputText
              value={this.state.department.optionLabel}
              onChange={e => {
                let department = { ...this.state.department }
                department.optionLabel = e.target.value
                this.setState({ department })
              }}
              className='p-inputtext'
              tabIndex={2}
            />

            <div className='label'>Director(a) de este departamento</div>
            <Dropdown
              name='department.managerId'
              value={this.state.department.managerId}
              options={this.state.officialsArray}
              className='p-inputtext'
              onChange={e => {
                let department = { ...this.state.department }
                department.managerId = e.target.value
                this.setState({ department })
              }}
              filter={true}
              filterPlaceholder='Seleccione un director'
              placeholder='Seleccione un director'
            />
            <div className='label'>Categoria a la que pertenece el departamento</div>
            <Dropdown
              name='department.informationCategory'
              value={this.state.department.informationCategoryId || ''}
              options={this.props.informationCategoriesList}
              className='p-inputtext'
              onChange={e => {
                let department = { ...this.state.department }
                department.informationCategoryId = e.target.value
                this.setState({ department })
              }}
              filter={true}
              filterPlaceholder='Seleccione una categoría'
              placeholder='Seleccionar categoría'
            />
          </div>
          <div className='subheaderLabel'>INFORMACIÓN DE CONTACTO:</div>
          <div>
            <b>DIRECCIÓN</b>
          </div>
          <div className='fieldGroup'>
            <SearchBar
              handleChangeAddress={this.handleChangeAddress}
              latitude={this.state.department.contactInformation.address.latitude}
              longitude={this.state.department.contactInformation.address.longitude}
              address={this.state.department.contactInformation.address.formatted_address}
            />
            <div className='label'>Calle</div>
            <InputText
              value={this.state.department.contactInformation.address.streetName}
              onChange={e => {
                let department = { ...this.state.department }
                department.contactInformation.address.streetName = e.target.value
                this.setState({ department })
              }}
              className='p-inputtext'
              tabIndex={5}
            />

            <div className='label'>Numero</div>
            <InputText
              name='department.contactInformation.address.streetNumber'
              value={this.state.department.contactInformation.address.streetNumber}
              onChange={e => {
                let department = { ...this.state.department }
                department.contactInformation.address.streetNumber = e.target.value
                this.setState({ department })
              }}
              className='p-inputtext'
              tabIndex={6}
            />

            <div className='label'>Numero Departamento/Otro</div>
            <InputText
              name='department.contactInformation.address.departmentNumber'
              value={this.state.department.contactInformation.address.departmentNumber}
              onChange={e => {
                let department = { ...this.state.department }
                department.contactInformation.address.departmentNumber = e.target.value
                this.setState({ department })
              }}
              className='p-inputtext'
              tabIndex={7}
            />

            <div className='label'>Ciudad</div>
            <InputText
              name='department.contactInformation.address.city'
              value={this.state.department.contactInformation.address.city}
              onChange={e => {
                let department = { ...this.state.department }
                department.contactInformation.address.city = e.target.value
                this.setState({ department })
              }}
              className='p-inputtext'
              tabIndex={8}
            />

            <div className='label'>Provincia</div>
            <InputText
              name='department.contactInformation.address.administrativeAreaLevel2'
              value={this.state.department.contactInformation.address.administrativeAreaLevel2}
              onChange={e => {
                let department = { ...this.state.department }
                department.contactInformation.address.administrativeAreaLevel2 = e.target.value
                this.setState({ department })
              }}
              className='p-inputtext'
              tabIndex={9}
            />

            <div className='label'>Región</div>
            <InputText
              name='department.contactInformation.address.administrativeAreaLevel1'
              value={this.state.department.contactInformation.address.administrativeAreaLevel1}
              onChange={e => {
                let department = { ...this.state.department }
                department.contactInformation.address.administrativeAreaLevel1 = e.target.value
                this.setState({ department })
              }}
              className='p-inputtext'
              tabIndex={10}
            />

            <div className='label'>País</div>
            <InputText
              name='contactInformation.address.country'
              value={this.state.department.contactInformation.address.country}
              onChange={e => {
                let department = { ...this.state.department }
                department.contactInformation.address.country = e.target.value
                this.setState({ department })
              }}
              className='p-inputtext'
              tabIndex={11}
            />

            <div className='label'>Código Postal</div>
            <InputText
              name='department.contactInformation.address.postalCode'
              value={this.state.department.contactInformation.address.postalCode}
              onChange={e => {
                let department = { ...this.state.department }
                department.contactInformation.address.postalCode = e.target.value
                this.setState({ department })
              }}
              className='p-inputtext'
              tabIndex={11}
            />
          </div>
          <div>
            <b>TELÉFONO</b>
          </div>
          <div className='fieldGroup'>
            <div className='label'>Código de área</div>
            <InputText
              type='number'
              name='department.contactInformation.phone.areaCode'
              value={this.state.department.contactInformation.phone.areaCode || ''}
              onChange={e => {
                let department = { ...this.state.department }
                department.contactInformation.phone.areaCode = e.target.value
                this.setState({ department })
              }}
              className='p-inputtext'
              tabIndex={13}
            />

            <div className='label'>Número</div>
            <InputText
              type='number'
              name='department.contactInformation.phone.number'
              value={this.state.department.contactInformation.phone.number || ''}
              onChange={e => {
                let department = { ...this.state.department }
                department.contactInformation.phone.number = e.target.value
                this.setState({ department })
              }}
              className='p-inputtext'
              tabIndex={14}
            />

            <div className='label'>Celular</div>
            <InputText
              name='department.contactInformation.phone.mobile'
              value={this.state.department.contactInformation.phone.mobile || ''}
              onChange={e => {
                let department = { ...this.state.department }
                department.contactInformation.phone.mobile = e.target.value
                this.setState({ department })
              }}
              className='p-inputtext'
              tabIndex={15}
            />

            <div className='label'>Email</div>
            <InputText
              name='department.contactInformation.email'
              type='email'
              value={this.state.department.contactInformation.email || ''}
              onChange={e => {
                let department = { ...this.state.department }
                department.contactInformation.email = e.target.value
                this.setState({ department })
              }}
              className='p-inputtext'
              tabIndex={16}
            />

            <div className='label'>
              Horarios de atención (Ej: lunes a jueves / 08:30 a 13:30 / Viernes 08:30 a 16:30)
            </div>
            <InputText
              name='department.businessHours'
              type='text'
              value={this.state.department.businessHours}
              onChange={e => {
                let department = { ...this.state.department }
                department.businessHours = e.target.value
                this.setState({ department })
              }}
              className='p-inputtext'
              tabIndex={17}
            />

            <div className='label'>Descripción de funciones del departamento</div>
            <InputText
              name='department.description'
              type='text'
              value={this.state.department.description}
              onChange={e => {
                let department = { ...this.state.department }
                department.description = e.target.value
                this.setState({ department })
              }}
              className='p-inputtext'
              tabIndex={18}
            />

            <div className='label'>Imagen del edificio donde se encuentra el departamento</div>

            <div className='flex-cols'>
              <InputText
                name='department.imageUrl'
                type='url'
                value={this.state.department.imageUrl}
                onChange={e => {
                  let department = { ...this.state.department }
                  department.imageUrl = e.target.value
                  this.setState({ department })
                }}
                className='inputtextIconUrl'
                tabIndex={19}
              />
              <div className='UploadImage m6'>
                {this.state.isUploading ? this.handleSpinner() : this.handleUploadImage()}
              </div>
            </div>

            <div className='label'>Dirección del departamento de tránsito</div>
            <InputText
              name='department.address'
              type='text'
              value={this.state.department.address}
              onChange={e => {
                let department = { ...this.state.department }
                department.address = e.target.value
                this.setState({ department })
              }}
              className='p-inputtext'
              tabIndex={20}
            />
            <div className='label'>Tags</div>
            <div>
              <Chips
                value={this.state.department.tags}
                placeholder='Agregar tag'
                onChange={e => {
                  console.log(e)
                  let department = { ...this.state.department }
                  department.tags = e.value
                  this.setState({ department })
                }}
                tooltip='Para agregar un nuevo tag debe ingresar el tag  y dar enter'
              />
            </div>
          </div>
          <br />
          <Button
            onClick={() => this.BackList()}
            style={{ marginRight: 10 }}
            label='Cancelar'
            className='p-button-secondary'
            type='button'
          />
          {this.props.type === 'create' && (
            <Button label='Crear Departamento' style={{ marginRight: 10 }} type='submit' />
          )}
          {this.props.type === 'update' && (
            <Button label='Guardar' style={{ marginRight: 10 }} type='submit' />
          )}
          {this.props.type === 'update' && (
            <Button
              className='p-button-danger'
              type='button'
              label='Eliminar'
              style={{ marginRight: 10 }}
              onClick={() => this.confirmDelete()}
            />
          )}
        </Section>
      </form>
    )
  }
}
export default TemplateDepartment
