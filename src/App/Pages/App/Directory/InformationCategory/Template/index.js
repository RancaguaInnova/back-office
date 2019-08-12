import React, { Component } from 'react'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import Section from 'App/components/Section'
import PropTypes from 'prop-types'
import FileUploader from 'react-firebase-file-uploader'
import firebase from '/src/App/helpers/auth/firebaseConfig'
import { Chips } from 'primereact/chips'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Button } from 'primereact/button'
import './style.css'
import InformationCategoryFragments from 'App/fragments/InformationCategory'
import { confirmAlert } from 'react-confirm-alert'
import { InputSwitch } from 'primereact/inputswitch'

@withMessage
@withGraphQL(gql`
  query informationCategory($informationCategoryId: ID!) {
    informationCategory(informationCategoryId: $informationCategoryId) {
      ...FullInformationCategory
    }
    informationCategoriesList {
      _id
      name
    }
  }
  ${InformationCategoryFragments.FullInformationCategory}
`)
@withMutation(gql`
  mutation createInformationCategory($informationCategory: InformationCategoryInput!) {
    createInformationCategory(informationCategory: $informationCategory) {
      ...FullInformationCategory
    }
  }
  ${InformationCategoryFragments.FullInformationCategory}
`)
@withMutation(gql`
  mutation updateInformationCategory($informationCategory: InformationCategoryInput!) {
    updateInformationCategory(InformationCategory: $informationCategory) {
      ...FullInformationCategory
    }
  }
  ${InformationCategoryFragments.FullInformationCategory}
`)
@withMutation(gql`
  mutation deleteInformationCategory($_id: ID!) {
    deleteInformationCategory(_id: $_id)
  }
`)
export default class Template extends Component {
  static propTypes = {
    history: PropTypes.object,
    description: PropTypes.string,
    title: PropTypes.string,
    informationCategoriesList: PropTypes.array,
    informationCategory: PropTypes.object,
    type: PropTypes.string,
    createInformationCategory: PropTypes.func,
    updateInformationCategory: PropTypes.func,
    deleteInformationCategory: PropTypes.func,
    showMessage: PropTypes.func,
    informationCategoryId: PropTypes.string
  }
  constructor(props) {
    super(props)
    if (this.props.type === 'create') {
      this.state = {
        name: '',
        parent: [],
        description: '',
        iconURL: '',
        optionLabel: '',
        urlRedirect: '',
        imageHeaderUrl: '',
        urlIframe: '',
        tags: [],
        active: true
      }
    }
    if (this.props.type === 'update') {
      this.state = this.props.informationCategory
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  handleInputChange = e => {
    const { name, value } = e.target
    this.setState({ ...this.state, [name]: value })
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
      .ref('CategoryImages')
      .child(filename)
      .getDownloadURL()
      .then(url => {
        this.setState({ ...this.state, iconURL: url })
      })
  }
  goBack() {
    this.props.history.push('/directorio/categorias')
  }
  handleUploadSuccessHeader = filename => {
    this.setState({
      uploadImageUrl: filename,
      progress: 100,
      isUploading: false
    })
    firebase
      .storage()
      .ref('CategoryImages')
      .child(filename)
      .getDownloadURL()
      .then(url => {
        this.setState({ ...this.state, imageHeaderUrl: url })
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
          storageRef={firebase.storage().ref('CategoryImages')}
          onUploadStart={this.handleUploadStart}
          onUploadError={this.handleUploadError}
          onUploadSuccess={this.handleUploadSuccess}
          onProgress={this.handleProgress}
        />
      </span>
    )
  }

  handleUploadImageHeader() {
    return (
      <span className='p-button p-fileupload-choose p-component p-button-text-icon-left p-button-success'>
        <span className='p-button-icon-center pi pi-plus m6' />
        <FileUploader
          accept='image/*'
          name='uploadImageUrl'
          className='p-inputtext p-component p-inputtext p-filled'
          randomizeFilename
          storageRef={firebase.storage().ref('CategoryImages')}
          onUploadStart={this.handleUploadStart}
          onUploadError={this.handleUploadError}
          onUploadSuccess={this.handleUploadSuccessHeader}
          onProgress={this.handleProgress}
        />
      </span>
    )
  }

  handleSpinner() {
    return <ProgressSpinner style={{ width: '30px', height: '30px' }} />
  }
  handleChip() {
    return <Chips />
  }

  async handleSubmit(e) {
    e.preventDefault()
    let category = this.state
    delete category.isUploading
    delete category.uploadImageUrl
    delete category.progress

    if (this.props.type === 'create') {
      try {
        await this.props.createInformationCategory({ informationCategory: category })
        this.onSuccessInsert()
      } catch (error) {
        this.props.showMessage('Ocurrió un error!')
      }
    } else {
      try {
        await this.props.updateInformationCategory({ informationCategory: category })
        this.onSuccessUpdate()
      } catch (error) {
        this.props.showMessage('Ocurrió un error!')
      }
    }
  }
  onSuccessDelete() {
    this.props.showMessage('Categoría eliminada correctamente')
    this.props.history.push('/directorio/categorias')
  }
  onSuccessInsert() {
    this.props.showMessage('Categoría creada correctamente')
    this.props.history.push('/directorio/categorias')
  }

  onSuccessUpdate() {
    this.props.showMessage('La categoría fue actualizada correctamente')
    this.props.history.push('/directorio/categorias')
  }
  confirmDelete() {
    confirmAlert({
      title: 'Confirmar acción',
      message: '¿Esta seguro de eliminar esta categoría?',
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
  async onDelete() {
    try {
      await this.props.deleteInformationCategory({ _id: this.state._id })
      this.onSuccessDelete()
    } catch (error) {
      console.log(error)
      this.props.showMessage('Ocurrió un error al eliminar la categoria')
    }
  }
  render() {
    const informationCategoryId = this.props.informationCategoryId
    let categorias = this.props.informationCategoriesList.filter(
      item => item._id !== informationCategoryId
    )

    return (
      <form onSubmit={this.handleSubmit}>
        <Section title={this.props.title} description={this.props.description} top>
          <div className='label'>Nombre</div>
          <InputText
            name='name'
            value={this.state.name}
            onChange={this.handleInputChange}
            className='p-inputtext'
            required
            tabIndex={1}
          />
          <div className='label'>Descripción</div>
          <InputText
            name='description'
            value={this.state.description || ''}
            onChange={this.handleInputChange}
            className='p-inputtext'
            tabIndex={2}
          />

          <div className='label'>Url de redirección </div>
          <InputText
            name='urlRedirect'
            value={this.state.urlRedirect || ''}
            onChange={this.handleInputChange}
            className='p-inputtext'
            tabIndex={2}
          />
          <div className='label'>Url Icono</div>
          <div className='flex-cols'>
            <InputText
              name='iconURL'
              title='Debe ingresar una url del icono de la categoría'
              type='url'
              value={this.state.iconURL}
              onChange={this.handleInputChange}
              className='p-inputtextIconUrl'
              tabIndex={2}
            />
            <div className='UploadImage'>
              {this.state.isUploading ? this.handleSpinner() : this.handleUploadImage()}
            </div>
          </div>
          <div className='label'>Url imagen header</div>
          <div className='flex-cols'>
            <InputText
              name='imageHeaderUrl'
              title='Debe ingresar una url del header de la categoría'
              type='url'
              value={this.state.imageHeaderUrl || ''}
              onChange={this.handleInputChange}
              className='p-inputtextIconUrl'
              tabIndex={2}
            />
            <div className='UploadImage'>
              {this.state.isUploading ? this.handleSpinner() : this.handleUploadImageHeader()}
            </div>
          </div>
          <div className='label'>Categoría Padre</div>
          <Dropdown
            value={this.state.parent || ''}
            optionLabel='name'
            dataKey='_id'
            options={categorias}
            className='p-inputtext'
            onChange={e => {
              this.setState({ parent: e.value })
            }}
            filter={true}
            filterPlaceholder='Seleccione una categoría'
            placeholder='Seleccionar categoría'
          />
          <div className='label'>Texto que aparecera al seleccionar una categoria</div>
          <InputText
            name='optionLabel'
            value={this.state.optionLabel}
            onChange={this.handleInputChange}
            className='p-inputtext'
          />
          <div className='label'>Url Iframe en caso de usarlo</div>
          <InputText
            name='urlIframe'
            value={this.state.urlIframe}
            onChange={this.handleInputChange}
            className='p-inputtext'
          />
          <div className='label'>Tags</div>
          <div>
            <Chips
              value={this.state.tags}
              placeholder='Agregar tag'
              onChange={e => this.setState({ tags: e.value })}
              tooltip='Para agregar un nuevo tag debe ingresar el tag  y dar enter'
            />
          </div>
          <div className='label'>Activo</div>

          <InputSwitch
            checked={this.state.active || false}
            onChange={e => this.setState({ active: e.value })}
          />

          <br />
          <Button
            onClick={() => this.goBack()}
            style={{ marginRight: 10 }}
            label='Cancelar'
            className='p-button-secondary'
            type='button'
          />
          {this.props.type === 'create' && (
            <Button label='Crear Categoría' style={{ marginRight: 10 }} type='submit' />
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
