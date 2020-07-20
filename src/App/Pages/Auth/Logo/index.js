import React from 'react';
import { Container } from 'react-bootstrap';

export default class Logo extends React.Component {
  static propTypes = {}

  render() {
    return (
      <Container className="text-center mt-3">
        <img src="/assets/logo.png" className="img-fluid" />
      </Container>
    )
  }
}
