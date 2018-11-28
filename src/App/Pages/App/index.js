import React from 'react'
import styles from './styles.css'
import { Route, Switch } from 'react-router-dom'
import Home from './Home'
import Settings from './Settings'
import Directory from './Directory'
import Calendar from './Calendar'
import Users from './Users'
// import ServiceAreas from './ServiceAreas'
import Applications from './Applications'
import Developers from './Developers'

export default class MainHome extends React.Component {
  render () {
    return (
      <div className={styles.container}>
        <Switch>
          <Route path='/settings' component={Settings} />
          <Route path='/directorio' component={Directory} />
          <Route path='/calendario' component={Calendar} />
          <Route path='/usuarios' component={Users} />
          <Route path='/apps' component={Applications} />
          <Route path='/devs' component={Developers} />
          <Route path='/' component={Home} />
        </Switch>
      </div>
    )
  }
}
