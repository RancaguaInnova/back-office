import React, { Component } from 'react'
import SearchBar from './SearchBar'
import ReactDependentScript from 'react-dependent-script'
import PropTypes from 'prop-types'

export default class SearchGoogle extends Component {
  static propTypes = {
    handleChangeAddress: PropTypes.func,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    address: PropTypes.string
  }

  render() {
    return (
      <ReactDependentScript
        scripts={[
          'https://maps.googleapis.com/maps/api/js?key=AIzaSyAmQ7APQAvy5cbGkGba-KZNT_VHHlLddeI&libraries=places'
        ]}
      >
        <SearchBar
          handleChangeAddress={this.props.handleChangeAddress}
          address={this.props.address || null}
          latitude={this.props.latitude || null}
          longitude={this.props.longitude || null}
        />
      </ReactDependentScript>
    )
  }
}
