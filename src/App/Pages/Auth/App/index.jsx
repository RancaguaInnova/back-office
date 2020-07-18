import React, { Component } from 'react';

var AppLink = require('react-applink')

export default class index extends React.Component {
  render() {
    const WEB = 'https://rancagua.cl'
    const LINK = 'com.rancagua.digital'
    const DOWNLOAD = {
      android: 'https://play.google.com/store/apps/details?id=com.rancagua.digital&hl=es_CL',
      iOS: 'https://apps.apple.com/cl/app/rancagua-digital/id1448600402',
      other: WEB
    }
    return (
      <div>
        <AppLink href={WEB} link={LINK}>
          Ir a Rancagua digital
        </AppLink>
        <br />
        <AppLink href={DOWNLOAD} link={LINK}>
          Descarga Rancagua Digital
        </AppLink>
      </div>
    )
  }
}
