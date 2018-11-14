import React from 'react'
import {Route, Switch} from 'react-router-dom'
import styles from './styles.css'
import Breadcrumbs from 'App/components/Breadcrumbs'
import Container from 'orionsoft-parts/lib/components/Container'
import Tabs from 'orionsoft-parts/lib/components/Tabs'
import Directory from '../Directory'
import Calendar from '../Calendar'
import Users from '../Users'
import Applications from '../Applications'
// import ServiceAreas from '../ServiceAreas'

export default class DirectoryRoutes extends React.Component {
  renderBody () {
    return (
      <h2>Backoffice Rancagua</h2>
    )
  }

  render () {
    return (
      <div>
        <div className={styles.header}>
          <Breadcrumbs>Inicio</Breadcrumbs>
          <br />
          <Tabs
            items={[
              {title: 'Directorio', path: '/directorio'},
              {title: 'Calendario', path: '/calendario'},
              {title: 'Usuarios', path: '/usuarios'},
              {title: 'Aplicaciones', path: '/apps'}
            ]}
          />
        </div>
        <Container>
          <Switch>
            <Route path='/directorio' component={Directory} />
            <Route path='/calendario' component={Calendar} />
            <Route path='/usuarios' component={Users} />
            <Route path='/apps' component={Applications} />
          </Switch>
          {this.renderBody()}
        </Container>
      </div>
    )
  }
}
