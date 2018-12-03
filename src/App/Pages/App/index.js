import React from 'react'
import styles from './styles.css'
import { Route, Switch } from 'react-router-dom'
import Home from './Home'
// import ServiceAreas from './ServiceAreas'
import DynamicComponent from 'App/components/DynamicComponent'

export default class MainHome extends React.Component {
  render () {
    return (
      <div className={styles.container}>
        <Switch>
          <Route
            path='/settings'
            component={DynamicComponent(() => import('./Settings'))}
          />
          <Route
            path='/directorio'
            component={DynamicComponent(() => import('./Directory'))}
          />
          <Route
            path='/calendario'
            component={DynamicComponent(() => import('./Calendar'))}
          />
          <Route
            path='/usuarios'
            component={DynamicComponent(() => import('./Users'))}
          />
          <Route
            path='/apps'
            component={DynamicComponent(() => import('./Applications'))}
          />
          <Route
            path='/devs'
            component={DynamicComponent(() => import('./Developers'))}
          />
          <Route
            path='/'
            component={DynamicComponent(() => import('./Home'))}
          />
        </Switch>
      </div>
    )
  }
}
