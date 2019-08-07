import React from 'react'
import PropTypes from 'prop-types'
import NotificationWidget from './NotificationWidget'
import { Button } from 'primereact/button'
import find from 'lodash/find'
import axios from 'axios'

import styles from './styles.css'

/**
 * Widget to select notification types and times
 */
export default class NotificationsSelector extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  static propTypes = {
    /** Id of the Notification document with notification details */
    notificationId: PropTypes.string.isRequired,
    /** Subject to check user subscriptions */
    theme: PropTypes.string,
    notificationData: PropTypes.shape({
      subject: PropTypes.string,
      body: PropTypes.string,
      departmentId: PropTypes.string
    })
  }

  componentDidMount = async () => {
    const { notificationId } = this.props
    if (notificationId) {
      const notificationRequest = new Request(
        `http://localhost:3100/${notificationId}`
      )
      const response = await fetch(notificationRequest)
    }
  }

  isValidDate = (currentDates, newDate) => {
    if (find(currentDates, item => item.getTime() === newDate.getTime())) {
      return false
    }
    if (newDate - new Date() < -1000 * 60 * 60 * 24) return false
    return true
  }

  addNotificationDate = (type, newDate) => {
    const currentDates = this.state[type] || []
    if (this.isValidDate(currentDates, newDate)) {
      currentDates.push(newDate)
    }
    this.setState({ [type]: currentDates })
  }

  handleSubmit = async e => {
    e.preventDefault()
    const {
      notificationId,
      theme,
      notificationData: { departmentId, subject, body }
    } = this.props
    const { email, push } = this.state

    console.log('type:', theme)
    console.log('departmentId:', departmentId)
    console.log('subject:', subject)
    console.log('body:', body)

    let url = 'http://localhost:3100/notifications'
    if (notificationId) url = url + `/${notificationId}`

    const request = new Request(url, {
      method: notificationId ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: theme,
        departmentId,
        subject,
        body,
        sendEmail: !!(email && email.length),
        sendPush: !!(push && push.length),
        schedule: this.state
      })
    })
    const response = await fetch(request)
  }

  render () {
    return (
      <div className={styles.frame}>
        <h3 className={styles.warningHeader}>Notificaciones</h3>
        <NotificationWidget
          subject='events'
          type='email'
          header='Email'
          text='Enviar notificacines vía email a los usuarios que se hayan suscrito a eventos:'
          addNotificationDate={this.addNotificationDate}
          notifications={this.state.email}
        />
        <NotificationWidget
          subject='events'
          type='push'
          header='Push'
          text='Enviar notificacines al teléfono de los usuarios que se hayan suscrito a eventos:'
          addNotificationDate={this.addNotificationDate}
          notifications={this.state.push}
        />
        <Button
          label='Guardar Notificaciones'
          onClick={e => this.handleSubmit(e)}
        />
      </div>
    )
  }
}
