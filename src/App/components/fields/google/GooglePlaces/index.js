import React, { Component } from 'react'
import SearchBar from './SearchBar'
import ReactDependentScript from 'react-dependent-script'
import PropTypes from 'prop-types'
export default class SearchGoogle extends Component {
  // Define Constructor

static propTypes={
  handleChangeAddress:PropTypes.func
}

 render() {
    return (
      <ReactDependentScript scripts={[
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyAmQ7APQAvy5cbGkGba-KZNT_VHHlLddeI&libraries=places'
      ]}>

      <SearchBar handleChangeAddress={this.props.handleChangeAddress}></SearchBar>
      </ReactDependentScript>
    )
  }
}
