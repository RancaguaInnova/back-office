import React, { Component } from 'react'
import Section from 'App/components/Section'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import gql from 'graphql-tag'
import UserFragments from 'App/fragments/User'
import WarningFrame from 'App/components/WarningFrame'
import { InputSwitch } from 'primereact/inputswitch'
import SearchBar from 'App/components/fields/GooglePlaces'
import autobind from 'autobind-decorator'
import { MultiSelect } from 'primereact/multiselect'
import { Calendar } from 'primereact/calendar'
import Es from '../../../../i18n/calendarEs'
import _merge from 'lodash/merge'
import formatRut from 'App/helpers/format/formatRut'
import getSession from 'App/helpers/auth/getSession'

import './style.css'

@withRouter
@withMessage
@withGraphQL(gql`
  query user($userId: ID!) {
    user(userId: $userId) {
      ...FullUser
    }
    departments {
      _id
      items {
        _id
        name
      }
    }
    Roles {
      _id
      name
    }
  }

  ${UserFragments.FullUser}
`)
@withMutation(gql`
  mutation updateUser($user: UserInput!) {
    updateUser(user: $user) {
      ...FullUser
    }
  }
  ${UserFragments.FullUser}
`)
@withMutation(gql`
  mutation createUser($user: UserInput!) {
    createUser(user: $user) {
      ...FullUser
    }
  }
  ${UserFragments.FullUser}
`)
@withMutation(gql`
  mutation deleteUser($_id: ID!) {
    deleteUser(_id: $_id)
  }
`)
export default class TemplateUsers extends Component {
  static propTypes = {
    history: PropTypes.object,
    type: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    userId: PropTypes.string,
    departments: PropTypes.object,
    user: PropTypes.object,
    Roles: PropTypes.array,
    createUser: PropTypes.func,
    updateUser: PropTypes.func,
    deleteUser: PropTypes.func,
    showMessage: PropTypes.func
  }
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      profile: {
        typeIdentificationDocument: '1',
        firstName: '',
        lastName: '',
        identifier: '',
        birthdate: '',
        gender: '',
        address: {
          streetName: '',
          streetNumber: '',
          latitude: -34.1703131,
          longitude: -70.74064759999999,
          formatted_address: '',
          administrativeAreaLevel1: '',
          administrativeAreaLevel2: '',
          city: '',
          departmentNumber: '',
          postalCode: '',
          country: '',
          place_id: ''
        },
        phone: {
          mobilePhone: '',
          number: '',
          areaCode: ''
        }
      },
      roles: []
    }
  }
  goBack() {
    this.props.history.push('/usuarios/lista')
  }
  @autobind
  componentDidMount() {
    if (this.props.type === 'update') {
      var state = _merge(this.state, this.props.user)

      let bir = state.profile.birthdate
      const birthdate = new Date(bir)
      var address = state.profile.address
      if (address === null) {
        address = {}
      }
      var phone = state.profile.phone
      if (phone === null) {
        phone = {}
      }
      let departmentIds = this.formatTagsDepartaments(state.profile.departmentIds)
      let roles = this.formatRolesToSelect(state.roles || [])

      var profile = _merge(state.profile, {
        birthdate: birthdate,
        address: address,
        phone: phone,
        departmentIds: departmentIds
      })
      state.profile = profile
      state.roles = roles
      this.setState(state)
    }
  }
  @autobind
  async handleDelete() {
    try {
      await this.props.deleteUser({ _id: this.state._id })
      this.onSuccessDelete()
    } catch (error) {
      this.props.showMessage('Ocurrió un error al eliminar el usuario')
    }
  }
  @autobind
  handleChangeAddress(contactInformationAddress) {
    let profile = { ...this.state.profile }

    let address = Object.assign(this.state.profile.address, {
      streetName: contactInformationAddress.streetName || '',
      administrativeAreaLevel1: contactInformationAddress.administrativeAreaLevel1 || '',
      administrativeAreaLevel2: contactInformationAddress.administrativeAreaLevel2 || '',
      city: contactInformationAddress.city || '',
      departmentNumber: contactInformationAddress.departmentNumber || '',
      postalCode: contactInformationAddress.postalCode || '',
      streetNumber: contactInformationAddress.streetNumber || '',
      country: contactInformationAddress.country || '',
      formatted_address: contactInformationAddress.formatted_address || '',
      place_id: contactInformationAddress.place_id || '',
      latitude: contactInformationAddress.latitude || '',
      longitude: contactInformationAddress.longitude || ''
    })
    profile.address = address
    this.setState({ profile })
  }

  @autobind
  async onSubmit(e) {
    e.preventDefault()
    let user = this.state

    let departmentIds = this.formatBackTags(user.profile.departmentIds)
    user.profile.departmentIds = departmentIds
    let roles = this.formatApiRoles(user.roles)
    user.roles = roles

    delete user.email
    if (this.props.type === 'create') {
      try {
        const { email } = this.state
        const emails = Object.assign({
          emails: [{ address: email, verified: false }]
        })
        user.emails = emails
        await this.props.createUser({ user: user })
        this.onSuccessInsert()
      } catch (error) {
        this.props.showMessage('Ocurrión un error!')
      }
    } else {
      try {
        await this.props.updateUser({ user: user })
        this.onSuccessUpdate()
      } catch (error) {
        this.props.showMessage('Ocurrión un error!')
      }
    }
  }
  onSuccessDelete() {
    this.props.showMessage('Usuario eliminado correctamente')
    this.props.history.push('/usuarios/lista')
  }
  onSuccessInsert() {
    this.props.showMessage('Usuario creado correctamente')
    this.props.history.push('/usuarios/lista')
  }

  onSuccessUpdate() {
    this.props.showMessage('El usuario fue actualizado correctamente')
    this.props.history.push('/usuarios/lista')
  }
  formatBackTags(arrayTags) {
    let a = arrayTags || []
    if (a.length === 0) {
      return []
    } else {
      let ar = a.map(function(obj) {
        var rObj = {}
        rObj = obj._id || ''

        return rObj
      })
      return ar
    }
  }
  formatTagsDepartaments() {
    let a = this.state.profile.departmentIds || []
    let departments = this.props.departments.items
    if (a.length === 0) {
      return []
    } else {
      let departmentsSelect = departments.map(function(obj) {
        var rObj = {}
        let select = a.indexOf(obj._id)
        if (select !== -1) {
          rObj = obj
          return rObj
        }
      })
      var filtered = departmentsSelect.filter(function(el) {
        return el !== null && el !== undefined
      })
      return filtered
    }
  }
  formatRolesToSelect(ArrayRoles) {
    if (ArrayRoles.length > 0) {
      let Roles = this.props.Roles.map(function(obj) {
        var rObj = {}
        let select = ArrayRoles.indexOf(obj.name)
        if (select !== -1) {
          rObj = obj
          return rObj
        }
      })

      var filtered = Roles.filter(function(el) {
        return el !== null && el !== undefined
      })
      return filtered
    } else {
      return []
    }
  }
  formatApiRoles(arrayRoles) {
    let a = arrayRoles || []
    if (a.length === 0) {
      return []
    } else {
      let ar = a.map(function(obj) {
        var rObj = {}
        rObj = obj.name || ''

        return rObj
      })
      return ar
    }
  }

  render() {
    const arrayGender = [{ label: 'Hombre', value: 'hombre' }, { label: 'Mujer', value: 'mujer' }]
    const Session = getSession()
    return (
      <form onSubmit={this.onSubmit}>
        <Section title={this.props.title} description={this.props.description} top>
          <div>
            <div className='label'>Email:</div>
            <InputText
              value={this.state.email || ''}
              type='email'
              onChange={e => {
                let email = { ...this.state.email }
                email = e.target.value
                this.setState({ email })
              }}
              className='w100'
              required
            />
            <div className='label'>Nombre:</div>
            <InputText
              value={this.state.profile.firstName || ''}
              type='text'
              onChange={e => {
                let profile = { ...this.state.profile }
                profile.firstName = e.target.value
                this.setState({ profile })
              }}
              className='w100'
            />
            <div className='label'>Apellido:</div>
            <InputText
              value={this.state.profile.lastName || ''}
              type='text'
              onChange={e => {
                let profile = { ...this.state.profile }
                profile.lastName = e.target.value
                this.setState({ profile })
              }}
              className='w100'
            />
            <div className='label'>Fecha de nacimiento:</div>
            <Calendar
              locale={Es}
              dateFormat='dd-mm-yy'
              value={this.state.profile.birthdate || ''}
              onChange={e => {
                let profile = { ...this.state.profile }
                profile.birthdate = e.value
                this.setState({ profile })
              }}
            />

            <div className='label'>DOCUMENTO:</div>
            <div className='IdentifierDiv'>
              <Dropdown
                required={true}
                className='p-inputtextDocumento'
                dataKey='value'
                value={this.state.profile.typeIdentificationDocument || 'rut'}
                options={[
                  { label: 'Rut', value: 'rut' },
                  { label: 'Pasaporte', value: 'pasaporte' }
                ]}
                onChange={e => {
                  let profile = { ...this.state.profile }
                  profile.typeIdentificationDocument = e.value
                  this.setState({ profile })
                }}
                showClear={true}
                placeholder='Tipo Documento'
              />
              <InputText
                value={this.state.profile.identifier || ''}
                type='text'
                className='w100 p-inputtextIdentifier'
                required
                placeholder='12.345.678-9'
                pattern='[0-9]{1,2}.[0-9]{3}.[0-9]{3}-[0-9Kk]'
                title='Ingrese un rut válido'
                onBlur={e => {
                  let profile = { ...this.state.profile }
                  profile.identifier = formatRut(e.target.value)
                  this.setState({ profile })
                }}
                onChange={e => {
                  let profile = { ...this.state.profile }
                  profile.identifier = e.target.value
                  this.setState({ profile })
                }}
              />
            </div>
            <div className='label'>Género:</div>
            <Dropdown
              dataKey='value'
              className='w100'
              value={this.state.profile.gender || ''}
              options={arrayGender}
              filterBy='label,value'
              showClear={true}
              onChange={e => {
                let profile = { ...this.state.profile }
                profile.gender = e.value
                this.setState({ profile })
              }}
              placeholder='Seleccione Género'
            />

            <div className='label'>
              DIRECCIÓN:
              <SearchBar
                handleChangeAddress={this.handleChangeAddress}
                latitude={this.state.profile.address.latitude || -34.1703131}
                longitude={this.state.profile.address.longitude || -70.74064759999999}
                address={this.state.profile.address.formatted_address}
              />
              <div className='label'>Nombre de Calle:</div>
              <InputText
                className='w100'
                value={this.state.profile.address.streetName || ''}
                type='text'
                onChange={e => {
                  let profile = { ...this.state.profile }
                  let address = { ...profile.address }
                  address.streetName = e.target.value
                  profile.address = address
                  this.setState({ profile })
                }}
              />
              <div className='label'>Numeración:</div>
              <InputText
                className='w100'
                value={this.state.profile.address.streetNumber || ''}
                type='text'
                onChange={e => {
                  let profile = { ...this.state.profile }
                  let address = { ...profile.address }
                  address.streetNumber = e.target.value
                  profile.address = address
                  this.setState({ profile })
                }}
              />
              <div className='label'>Número de departamento o casa:</div>
              <InputText
                value={this.state.profile.address.departmentNumber || ''}
                type='text'
                className='w100'
                onChange={e => {
                  let profile = { ...this.state.profile }
                  let address = { ...profile.address }
                  address.departmentNumber = e.target.value
                  profile.address = address
                  this.setState({ profile })
                }}
              />
            </div>
            <div className='label'>
              TELÉFONO:
              <div className='label'>Celular:</div>
              <InputText
                type='text'
                tooltip='El formato válido del celular es +569xxxxxxxx'
                required
                title='Debe ingresar un número de celular válido en formato  +569xxxxxxxx'
                className='w100'
                pattern='[+]569[0-9]{8}'
                value={this.state.profile.phone.mobilePhone || ''}
                onChange={e => {
                  let profile = { ...this.state.profile }
                  profile.phone.mobilePhone = e.target.value
                  this.setState({ profile })
                }}
              />
              <div className='label'>Código de área:</div>
              <InputText
                className='w100'
                maxLength='5'
                value={this.state.profile.phone.areaCode || ''}
                type='number'
                onChange={e => {
                  let profile = { ...this.state.profile }
                  let phone = { ...profile.phone }
                  phone.areaCode = e.target.value
                  profile.phone = phone
                  this.setState({ profile })
                }}
              />
              <div className='label'>Numero:</div>{' '}
              <InputText
                className='w100'
                maxLength='10'
                value={this.state.profile.phone.number || ''}
                type='number'
                onChange={e => {
                  let profile = { ...this.state.profile }
                  let phone = { ...profile.phone }
                  phone.number = e.target.value
                  profile.phone = phone
                  this.setState({ profile })
                }}
              />
            </div>
            <div className='label'>Nivel Educacional:</div>
            <Dropdown
              className='w100'
              dataKey='value'
              showClear={true}
              value={this.state.profile.educationalLevel || ''}
              options={[
                { label: 'Educación Básica', value: 'basica' },
                { label: 'Educación Media', value: 'media' },
                { label: 'Educación Superior', value: 'superior' }
              ]}
              onChange={e => {
                let profile = { ...this.state.profile }
                profile.educationalLevel = e.value
                this.setState({ profile })
              }}
              placeholder='Seleccione Nivel Educacional'
            />
            <div className='label'>Departamento(s)</div>
            <MultiSelect
              className='w100'
              optionLabel='name'
              dataKey='_id'
              value={this.state.profile.departmentIds}
              options={this.props.departments.items}
              onChange={e => {
                let profile = { ...this.state.profile }
                profile.departmentIds = e.value
                this.setState({ profile })
              }}
              filter={true}
            />
            {Session.roles.indexOf('admin') > -1 && <div className='label'>Rol(es)</div>}
            {Session.roles.indexOf('admin') > -1 && (
              <MultiSelect
                className='w100'
                optionLabel='name'
                dataKey='_id'
                value={this.state.roles}
                options={this.props.Roles}
                onChange={e => {
                  let roles = { ...this.state }
                  roles = e.value
                  this.setState({ roles })
                }}
                filter={true}
              />
            )}
            <p />
            <WarningFrame warningMessage='Un usuario desactivado no podrá ingresar a la aplicación'>
              <div className='label'>Usuario Activo:</div>
              <InputSwitch
                className='w100'
                checked={this.state.active}
                onChange={e => this.setState({ active: e.value })}
              />
            </WarningFrame>
          </div>
          <br />
          <div>
            <Button
              label='Cancelar'
              icon='pi pi-arrow-circle-left'
              style={{ marginRight: 10 }}
              className='p-button-secondary'
              onClick={() => this.goBack()}
              type='button'
            />
            <Button type='submit' label='Guardar' icon='pi pi-save' style={{ marginRight: 10 }} />
            {this.props.type === 'update' && (
              <Button
                type='button'
                label='Eliminar'
                style={{ marginRight: 10 }}
                onClick={this.handleDelete}
                icon='pi pi-times'
                className='p-button-danger'
              />
            )}
          </div>
        </Section>
      </form>
    )
  }
}
