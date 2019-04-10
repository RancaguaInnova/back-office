import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import Button from 'orionsoft-parts/lib/components/Button'

import Container from 'orionsoft-parts/lib/components/Container'

@withRouter
export default class NotAuthorized extends React.Component {
  static propTypes = {
    history: PropTypes.object
  }

  render() {
    return (
      <Container>
        <h1>No Autorizado</h1>
        <h4 style={{ marginBottom: 50 }}>
          No tienes los privilegios necesarios para ver esta página.
        </h4>
        <Button onClick={() => this.props.history.goBack()} primary>
          Volver
        </Button>
      </Container>
    )
  }
}
