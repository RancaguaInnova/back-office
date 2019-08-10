import React from 'react'
import PropTypes from 'prop-types'
import NotificationWidget from './NotificationWidget'
import { Button } from 'primereact/button'
import find from 'lodash/find'
import moment from 'moment'
import { get } from 'App/helpers/requests/notifications'
import withServices from 'App/components/WithServices'
import remove from 'lodash/remove'

import styles from './styles.css'

/**
 * Widget to select notification types and times
 */
class NotificationsSelector extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  static propTypes = {
    /** Id of the Notification document with notification details */
    notificationId: PropTypes.string,
    /** Subject to check user subscriptions */
    theme: PropTypes.string,
    notificationData: PropTypes.shape({
      subject: PropTypes.string,
      body: PropTypes.string,
      departmentId: PropTypes.string
    }),
    handleNotifications: PropTypes.func
  }

  componentDidMount = async () => {
    const { notificationId, services } = this.props
    if (notificationId) {
      try {
        const notification = await services.notifications.get(notificationId)
        this.setState({ ...notification.schedule })
      } catch (error) {
        console.log('Error getting Notification document:', error)
      }
    }
  }

  isValidDate = (currentDates, newDate) => {
    if (
      find(
        currentDates,
        item =>
          moment(item)
            .toDate()
            .getTime() ===
          moment(newDate)
            .toDate()
            .getTime()
      )
    ) {
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
    this.props.handleNotifications({ [type]: currentDates })
  }

  removeNotificationDate = (type, date) => {
    const currentDates = this.state[type] || []
    remove(currentDates, d => d === date)
    this.setState({ [type]: currentDates })
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
          removeNotificationDate={this.removeNotificationDate}
          notifications={this.state.email}
        />
        <NotificationWidget
          subject='events'
          type='push'
          header='Push'
          text='Enviar notificacines al teléfono de los usuarios que se hayan suscrito a eventos:'
          addNotificationDate={this.addNotificationDate}
          removeNotificationDate={this.removeNotificationDate}
          notifications={this.state.push}
        />
      </div>
    )
  }
}

export default withServices(
  NotificationsSelector,
  'http://localhost:3100',
  ['notifications'],
  ['get']
)
