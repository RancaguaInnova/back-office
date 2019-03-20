import React from 'react'
import PlacesAutocomplete from './PlacesAutocomplete'
import { geocodeByAddress, geocodeByPlaceLocation } from './utils'
import { classnames } from './helpers'
import styles from './styles.css'
import { Field } from 'simple-react-form'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import PropTypes from 'prop-types'

class SearchPlaceBar extends React.Component {
  static propTypes = {
    handleChangeAddress: PropTypes.func
  }
  constructor(props) {
    super(props)
    this.state = {
      address: '',
      errorMessage: '',
      latitude: -34.1719656,
      longitude: -70.7396144,
      gmapsLoaded: false,
      isGeocoding: false,
      componentForm: {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name',
        administrative_area_level_2: 'short_name'
      },
      street_number: '',
      route: '',
      locality: '',
      administrative_area_level_1: '',
      country: '',
      postal_code: '',
      administrative_area_level_2: '',
      marker: null,
      contactInformationAddress: {
        streetName: '',
        streetNumber: '',
        departmentNumber: '',
        city: '',
        postalCode: '',
        administrativeAreaLevel1: '',
        administrativeAreaLevel2: ''
      }

    }
  }

  handleChange = address => {
    this.setState({
      address,
      latitude: null,
      longitude: null,
      errorMessage: ''
    })
  }

  fillInAddress = place => {
    return new Promise((resolve, reject) => {
      try {
        console.log(place)

        for (var component in this.state.componentForm) {
          document.getElementById(component).value = ''
          document.getElementById(component).disabled = false
        }

        for (var i = 0; i < place.address_components.length; i++) {
          var addressType = place.address_components[i].types[0]
          console.log(addressType)

          if (this.state.componentForm[addressType]) {
           let cadena = place.address_components[i][this.state.componentForm[addressType]]
          if (addressType === 'street_number') {
           let aux = cadena.split(',')
           console.log(aux[0])
           document.getElementById('').value
           document.getElementById('').value
           departmentNumber
          } else {
                  var val = place.address_components[i][this.state.componentForm[addressType]]
                  document.getElementById(addressType).value = val
          }





          }
        }
        this.setState({
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
          street_number: document.getElementById('street_number').value,
          route: document.getElementById('route').value,
          locality: document.getElementById('locality').value,
          administrative_area_level_1: document.getElementById('administrative_area_level_1').value,
          country: document.getElementById('country').value,
          postal_code: document.getElementById('postal_code').value,
          administrative_area_level_2: document.getElementById('administrative_area_level_2').value,
          address: place.formatted_address,
          contactInformationAddress: {
            streetName: document.getElementById('route').value,
            streetNumber:document.getElementById('street_number').value,
            departmentNumber: '',
            city: '',
            postalCode: '',
            administrativeAreaLevel1: '',
            administrativeAreaLevel2: ''
          }

        })


        this.props.handleChangeAddress(this.state.contactInformationAddress)


        this.initMap()
        resolve(1)
      } catch (e) {
        console.log(e)
        reject(e)
      }
    })
  }

  handleSelect = selected => {
    console.log(selected)
    this.setState({ isGeocoding: true, address: selected })
    geocodeByAddress(selected).then(res => this.fillInAddress(res[0]))
  }

  handleCloseClick = () => {
    this.setState({
      address: '',
      latitude: null,
      longitude: null,
      componentForm: {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name',
        administrative_area_level_2: 'short_name',
      },
      street_number: '',
      route: '',
      locality: '',
      administrative_area_level_1: '',
      country: '',
      postal_code: '',
      administrative_area_level_2: '',
      maker: null
    })
  }

  handleError = (status, clearSuggestions) => {
    console.log('Error from Google Maps API', status) // eslint-disable-line no-console
    this.setState({ errorMessage: status }, () => {
      clearSuggestions()
    })
  }
  update = e => {
    const LatLng = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    }
    geocodeByPlaceLocation(LatLng).then(res => {
      this.fillInAddress(res[0])
    })
  }

  initMap() {
    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: this.state.latitude, lng: this.state.longitude },
      zoom: 17,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: window.google.maps.ControlPosition.TOP_CENTER
      },
      zoomControl: true,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.LEFT_CENTER
      },
      scaleControl: true,
      streetViewControl: true,
      streetViewControlOptions: {
        position: window.google.maps.ControlPosition.LEFT_TOP
      },
      fullscreenControl: true
    })
    var position = { lat: this.state.latitude, lng: this.state.longitude }

    var marker = new window.google.maps.Marker({ position: position, map: map, draggable: true })

    window.google.maps.event.addListener(marker, 'dragend', this.update)
  }

  componentDidMount() {
    this.initMap()
  }
  render() {
    const { address, errorMessage } = this.state

    return (
      <div>
        <PlacesAutocomplete
          onChange={this.handleChange}
          value={address}
          onSelect={this.handleSelect}
          onError={this.handleError}
          shouldFetchSuggestions={address.length > 2}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps }) => {
            return (
              <div className='search-bar-container'>
                <div className='os-input-container'>
                  <input
                    {...getInputProps({
                      placeholder: 'Buscar Dirección...',
                      className: 'search-input',
                      id: 'addressSearchPlace'
                    })}
                  />
                  {this.state.address.length > 0 && (
                    <button className='clear-button' onClick={this.handleCloseClick}>
                      x
                    </button>
                  )}
                </div>
                {suggestions.length > 0 && (
                  <div className='autocomplete-container'>
                    {suggestions.map(suggestion => {
                      const className = classnames('suggestion-item', {
                        'suggestion-item--active': suggestion.active
                      })

                      return (
                        /* eslint-disable react/jsx-key */
                        <div {...getSuggestionItemProps(suggestion, { className })}>
                          <strong>{suggestion.formattedSuggestion.mainText}</strong>{' '}
                          <small>{suggestion.formattedSuggestion.secondaryText}</small>
                        </div>
                      )
                      /* eslint-enable react/jsx-key */
                    })}
                    <div className='dropdown-footer' />
                  </div>
                )}
              </div>
            )
          }}
        </PlacesAutocomplete>
        {errorMessage.length > 0 && <div className='error-message'>{this.state.errorMessage}</div>}

        <div>
          <div id='map' className='map'>
            mapa
          </div>
          <div id='infowindow-content'>
            <img src='' width='16' height='16' id='place-icon' />
            <div id='place-name' className='title' />
            <div id='place-address' />
          </div>

          <div className={styles.label}>Calle</div>
          <Field fieldName='contactInformation.address.streetName' id='route' type={Text} value={this.state.route} />
          <div className={styles.label}>Numero</div>
          <Field
            fieldName='contactInformation.address.streetNumber'
            id='street_number'
            type={Text}
            value={this.state.street_number}
          />
       <Field
            fieldName='contactInformation.address.departmentNumber'
            id='departmentNumber'
            type={Text}
            value={this.state.departmentNumber}
          />
          <div className={styles.label}>Ciudad</div>
          <Field fieldName='contactInformation.address.city' id='locality' type={Text} value={this.state.locality} />

          <div className={styles.label}>Provincia</div>
          <Field
            fieldName='contactInformation.address.administrativeAreaLevel2'
            type={Text}
            id='administrative_area_level_2'
            value={this.state.administrative_area_level_2}
          />
          <div className={styles.label}>Región</div>
          <Field
            fieldName='contactInformation.address.administrativeAreaLevel1'
            type={Text}
            id='administrative_area_level_1'
            value={this.state.administrative_area_level_1}
          />
          <div className={styles.label}>País</div>
          <Field fieldName='contactInformation.address.country' type={Text} value={this.state.country} id='country' />
        </div>

        <div className={styles.label}>Código Postal</div>
        <Field fieldName='contactInformation.address.postalCode' type={Text} value={this.state.postal_code} id='postal_code' />
      </div>
    )
  }
}

export default SearchPlaceBar
