import React from 'react'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import Section from 'App/components/Section'
import { Button } from 'primereact/button'
import './style.css'
import PropTypes from 'prop-types'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import _ from 'lodash'
import { confirmAlert } from 'react-confirm-alert'
import autobind from 'autobind-decorator'

@withMessage
@withGraphQL(gql`
  query official($officialId: ID!) {
    official(officialId: $officialId) {
      _id
      firstname
      lastname
      optionLabel
      department
      contactInformation {
        email
      }
      position
      imageUrl
      grade
    }
  }
`)
@withGraphQL(gql`
  query departmentsList {
    departmentsList(page: "1") {
      items {
        value: _id
        label: name
      }
    }
  }
`)
@withMutation(gql`
  mutation createOfficial($Official: OfficialInput!) {
    createOfficial(Official: $Official) {
      _id
      position
      firstname
      lastname
      department
      contactInformation {
        email
      }
      grade
    }
  }
`)
@withMutation(gql`
  mutation updateOfficial($Official: OfficialInput!) {
    updateOfficial(Official: $Official) {
      _id
      position
      firstname
      lastname
      department
      contactInformation {
        email
      }
      grade
    }
  }
`)
@withMutation(gql`
  mutation deleteOfficial($_id: ID!) {
    deleteOfficial(_id: $_id)
  }
`)
class Template extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    showMessage: PropTypes.func,
    official: PropTypes.object,
    description: PropTypes.string,
    departmentsList: PropTypes.object,
    createOfficial: PropTypes.func,
    updateOfficial: PropTypes.func,
    deleteOfficial: PropTypes.func,
    type: PropTypes.string
  }
  constructor(props) {
    super(props)
    this.state = {
      official: {
        firstname: '',
        lastname: '',
        optionLabel: '',
        department: '',
        contactInformation: { email: '' },
        position: '',
        grade: 20
      },
      departmentD: this.props.departmentsList.items || []
    }
  }
  componentDidMount() {
    if (this.props.type === 'update') {
      var official = _.mergeWith(this.state.official, this.props.official, (a, b) =>
        b === null ? a : undefined
      )
      this.setState(official)
    }
  }
  handleInputChange = e => {
    const { name, value } = e.target
    let official = this.state.official
    _.set(official, name, value)
    this.setState({ official })
  }
  handleSelect = e => {
    let official = this.state.official
    official.department = e.value
    this.setState({ official })
  }
  handleSubmit = async e => {
    e.preventDefault()
    let OfficialInput = this.state.official
    const props = this.props

    try {
      if (props.type === 'create') {
        await this.props.createOfficial({ Official: OfficialInput })
        this.onSuccessInsert()
      } else {
        await this.props.updateOfficial({ Official: OfficialInput })
        this.onSuccessUpdate()
      }
    } catch (error) {
      this.props.showMessage('Ocurrió un error!')
    }
  }
  onSuccessDelete = () => {
    this.props.showMessage('Funcionario eliminado correctamente')
    this.props.history.push('/directorio/funcionarios')
  }
  onSuccessInsert = () => {
    this.props.showMessage('Funcionario creado correctamente')
    this.props.history.push('/directorio/funcionarios')
  }

  onSuccessUpdate = () => {
    this.props.showMessage('Funcionario actualizado correctamente')
    this.props.history.push('/directorio/funcionarios')
  }
  goBack = () => {
    this.props.history.push('/directorio/funcionarios')
  }
  @autobind
  confirmDelete() {
    confirmAlert({
      title: 'Confirmar acción',
      message: '¿Esta seguro de eliminar este funcionario?',
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
  async onDelete() {
    let OfficialInput = this.state.official

    try {
      await this.props.deleteOfficial({ _id: OfficialInput._id })
      this.onSuccessDelete()
    } catch (error) {
      console.log(error)
      this.props.showMessage('Ocurrió un error al eliminar la categoria')
    }
  }

  render() {
    const {
      props,
      handleInputChange,
      handleSubmit,
      confirmDelete,
      goBack,
      handleSelect,
      state
    } = this
    const { official, departmentD } = state

    return (
      <form onSubmit={handleSubmit}>
        <Section title={props.title} description={props.description} top>
          <div className='label'>Nombre</div>
          <InputText
            name='firstname'
            value={official.firstname}
            onChange={handleInputChange}
            className='p-inputtext'
            required
          />
          <div className='label'>Apellido</div>
          <InputText
            name='lastname'
            value={official.lastname}
            onChange={handleInputChange}
            className='p-inputtext'
            required
          />
          <div className='label'>Option Label</div>
          <InputText
            name='optionLabel'
            value={official.optionLabel}
            onChange={handleInputChange}
            className='p-inputtext'
            required
          />
          <div className='label'>Departamento</div>
          <Dropdown
            value={official.department}
            className='p-inputtext'
            options={departmentD}
            onChange={handleSelect}
            placeholder='Seleccione un departamento'
          />

          <div className='label'>Email</div>

          <InputText
            name='contactInformation.email'
            value={official.contactInformation.email}
            onChange={handleInputChange}
            className='p-inputtext'
            type='email'
          />
          <div className='label'>Cargo del funcionario</div>
          <InputText
            name='position'
            value={official.position}
            onChange={handleInputChange}
            className='p-inputtext'
          />
          <div className='label'>Grado</div>
          <InputText
            type='number'
            name='grade'
            value={official.grade}
            onChange={handleInputChange}
            className='p-inputtext'
          />
          <br />
          <br />
          <Button
            onClick={() => goBack()}
            style={{ marginRight: 10 }}
            label='Cancelar'
            className='p-button-secondary'
            type='button'
          />
          {props.type === 'create' && (
            <Button label='Crear funcionario' style={{ marginRight: 10 }} type='submit' />
          )}
          {props.type === 'update' && (
            <Button label='Guardar' style={{ marginRight: 10 }} type='submit' />
          )}
          {props.type === 'update' && (
            <Button
              className='p-button-danger'
              type='button'
              label='Eliminar'
              style={{ marginRight: 10 }}
              onClick={confirmDelete}
            />
          )}
          <br />
          <br />
          <br />
        </Section>
      </form>
    )
  }
}

export default Template
