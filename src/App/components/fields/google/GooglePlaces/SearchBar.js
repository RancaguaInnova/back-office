import React from 'react'
import PlacesAutocomplete from './PlacesAutocomplete'
import { geocodeByAddress, geocodeByPlaceLocation } from './utils'
import { classnames } from './helpers'
import styles from './styles.css'

import PropTypes from 'prop-types'

class SearchPlaceBar extends React.Component {
  static propTypes = {
    handleChangeAddress: PropTypes.func,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    address: PropTypes.string,
  }

  constructor(props) {
    super(props)
  
  let l = -34.1719656
    if (props.latitude != 0 && props.latitude !== null ){
       l = props.latitude
    } 
    let lg = -34.1719656

    if (props.longitude != 0 && props.longitude !== null  ) {
      lg=props.longitude
    }
    this.state = {
      address: props.address || '',
      errorMessage: '',
      latitude:l,
      longitude: lg,
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
        for (var i = 0; i < place.address_components.length; i++) {
          var addressType = place.address_components[i].types[0]

          if (this.state.componentForm[addressType]) {
            if (addressType === 'street_number') {
              let cadena = place.address_components[i][this.state.componentForm[addressType]]
              let aux = cadena.split(',')
              this.setState({
                street_number: aux[0]
              })
              try {
                this.setState({
                  departmentNumber: aux[1]
                })
              } catch (e) {
                this.setState({
                  departmentNumber: ''
                })
              }
            } else if (addressType === 'route') {
              let val = place.address_components[i][this.state.componentForm[addressType]]
              this.setState({
                streetName: val
              })
            } else if (addressType === 'locality') {
              let val = place.address_components[i][this.state.componentForm[addressType]]
              this.setState({
                city: val
              })
            } else if (addressType === 'postal_code') {
              let val = place.address_components[i][this.state.componentForm[addressType]]
              this.setState({
                postalCode: val
              })
            } else if (addressType === 'administrative_area_level_1') {
              let val = place.address_components[i][this.state.componentForm[addressType]]
              this.setState({
                administrative_area_level_1: val
              })

            } else if (addressType === 'administrative_area_level_2') {
              let val = place.address_components[i][this.state.componentForm[addressType]]
              this.setState({
                administrative_area_level_2: val
              })

            } else if (addressType === 'country') {
              let val = place.address_components[i][this.state.componentForm[addressType]]
              this.setState({
                country: val
              })

            }

          }
        }

        this.setState({
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
          contactInformationAddress: {
            streetName: this.state.streetName,
            streetNumber: this.state.street_number,
            departmentNumber: this.state.departmentNumber,
            city: this.state.city,
            postalCode: this.state.postal_code,
            administrativeAreaLevel1: this.state.administrative_area_level_1,
            administrativeAreaLevel2: this.state.administrative_area_level_2,
            country: this.state.country,      
            latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
          formatted_address: place.formatted_address,
          place_id: place.place_id,
          }
        })

        this.props.handleChangeAddress(this.state.contactInformationAddress)

        this.initMap()
        resolve(1)
      } catch (e) {
        reject(e)
      }
    })
  }

  handleSelect = selected => {
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
        administrative_area_level_2: 'short_name'
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
    this.setState({ errorMessage: status }, () => {
      clearSuggestions()
    })
  }
  update = e => {
    const LatLng = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
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
        </div>
      </div>
    )
  }
}

export default SearchPlaceBar
