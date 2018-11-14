import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Profile from './Profile'
import Password from './Password'
import Tabs from 'orionsoft-parts/lib/components/Tabs'
import PropTypes from 'prop-types'
import styles from './styles.css'
import Breadcrumbs from 'App/components/Breadcrumbs'
import Container from 'orionsoft-parts/lib/components/Container'

export default class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <div>
        <div className={styles.header}>
          <Breadcrumbs>Settings</Breadcrumbs>
          <br />
          <Tabs
            items={[
              {title: 'Profile', path: '/settings'},
              {title: 'Password', path: '/settings/password'}
            ]}
          />
        </div>
        <Container>
          <Switch>
            <Route exact path="/settings" component={Profile} />
            <Route path="/settings/password" component={Password} />
          </Switch>
        </Container>
      </div>
    )
  }
}
