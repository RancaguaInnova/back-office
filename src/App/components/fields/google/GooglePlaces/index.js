import React, { Component } from 'react'
import SearchBar from './SearchBar'
import ReactDependentScript from 'react-dependent-script'

export default class SearchGoogle extends Component {
  // Define Constructor
  constructor(props) {
    super(props)
    // Declare State
    this.state = {
      city: '',
      query: ''
    }
  }

  render() {
    return (
      <ReactDependentScript scripts={[
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyAmQ7APQAvy5cbGkGba-KZNT_VHHlLddeI&libraries=places'
      ]}>

      <SearchBar></SearchBar>
      </ReactDependentScript>
    )
  }
}
