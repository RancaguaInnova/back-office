import 'babel-polyfill'
import 'react-hot-loader/patch'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './styles'
import {AppContainer} from 'react-hot-loader'

ReactDOM.render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.getElementById('root')
)

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default
    ReactDOM.render(
      <AppContainer>
        <NextApp />
      </AppContainer>,
      document.getElementById('root')
    )
  })
}
