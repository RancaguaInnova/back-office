import React from 'react'
import PlacesAutocomplete from './PlacesAutocomplete'
import { geocodeByAddress, geocodeByPlaceLocation } from './utils'
import { classnames } from './helpers'
import styles from './styles.css'
import { Field } from 'simple-react-form'
import Text from 'orionsoft-parts/lib/components/fields/Text'
class SearchPlaceBar extends React.Component {
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
        administrative_area_level_2: 'short_name',
      },
      street_number: '',
      route: '',
      locality: '',
      administrative_area_level_1: '',
      country: '',
      postal_code: '',
      administrative_area_level_2: '',
      marker: null,
    }
  }

  handleChange = address => {
    this.setState({
      address,
      latitude: null,
      longitude: null,
      errorMessage: '',
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

          if (this.state.componentForm[addressType]) {
            var val = place.address_components[i][this.state.componentForm[addressType]]
            document.getElementById(addressType).value = val
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
        })
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
      maker: null,
    })
  }

  handleError = (status, clearSuggestions) => {
    console.log('Error from Google Maps API', status) // eslint-disable-line no-console
    this.setState({ errorMessage: status }, () => {
      clearSuggestions()
    })
  }
  update() {
    const LatLng = {
      lat: this.position.lat(),
      lng: this.position.lng()
    }
    geocodeByPlaceLocation(LatLng).then(res =>{
      this.fillInAddress(res[0])
    }
   )

  }

  initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: this.state.latitude, lng: this.state.longitude },
      zoom: 17,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_CENTER,
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER,
      },
      scaleControl: true,
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP,
      },
      fullscreenControl: true,
    })
    var position = { lat: this.state.latitude, lng: this.state.longitude }

    var marker = new google.maps.Marker({ position: position, map: map, draggable: true })

    google.maps.event.addListener(marker, 'dragend', this.update)
  }

  componentDidMount() {
    this.initMap()
  }
  render() {
    const { address, errorMessage, latitude, longitude, isGeocoding, maker } = this.state

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
                        'suggestion-item--active': suggestion.active,
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
          <Field fieldName='route' id='route' type={Text} value={this.state.route} />
          <div className={styles.label}>Numero</div>
          <Field
            fieldName='street_number'
            id='street_number'
            type={Text}
            value={this.state.street_number}
          />
          <div className={styles.label}>Ciudad</div>
          <Field fieldName='locality' id='locality' type={Text} value={this.state.locality} />
          <div className={styles.label}>Región</div>
          <Field
            fieldName='administrative_area_level_1'
            type={Text}
            id='administrative_area_level_1'
            value={this.state.administrative_area_level_1}
          />
          <div className={styles.label}>Provincia</div>
          <Field
            fieldName='administrative_area_level_2'
            type={Text}
            id='administrative_area_level_2'
            value={this.state.administrative_area_level_2}
          />
          <div className={styles.label}>Zip code</div>
          <Field
            fieldName='postal_code'
            type={Text}
            value={this.state.postal_code}
            id='postal_code'
          />
          <div className={styles.label}>País</div>
          <Field fieldName='country' type={Text} value={this.state.country} id='country' />
        </div>
      </div>
    )
  }
}

export default SearchPlaceBar
