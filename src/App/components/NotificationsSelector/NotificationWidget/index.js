import React from 'react'
import PropTypes from 'prop-types'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import sortBy from 'lodash/sortBy'
import isEmpty from 'lodash/isEmpty'

import styles from './styles.css'

export default class NotificationWidget extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tempDate: ''
    }

    this.locale = {
      firstDayOfWeek: 1,
      dayNames: [
        'Domingo',
        'Lunes',
        'Martes',
        ';iércoles',
        'Jueves',
        'Viernes',
        'Sábado'
      ],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      monthNames: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre'
      ],
      monthNamesShort: [
        'ene',
        'feb',
        'mar',
        'abr',
        'may',
        'jun',
        'jul',
        'ago',
        'sep',
        'oct',
        'nov',
        'dic'
      ],
      today: 'Hoy',
      clear: 'Borrar',
      dateFormat: 'dd/mm/yy',
      weekHeader: 'Sm'
    }
  }

  static propTypes = {
    type: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    addNotificationDate: PropTypes.func.isRequired,
    removeNotificationDate: PropTypes.func.isRequired,
    header: PropTypes.string,
    text: PropTypes.string,
    notifications: PropTypes.arrayOf(PropTypes.object)
  }

  renderSchedulledNotifications = () => {
    const notifications = sortBy(this.props.notifications, d => d)
    if (!isEmpty(notifications)) {
      return (
        <div className={styles.notifications}>
          Notificaciones programadas:
          {notifications.map((date, i) => {
            return (
              <div key={i} className={styles.date}>
                {moment(date).format('DD-MM-YYYY')}
                <Button
                  style={{
                    marginLeft: 40,
                    backgroundColor: '#e21b1b',
                    borderColor: '#e21b1b'
                  }}
                  icon='pi pi-minus'
                  tooltip='Eliminar esta notificación'
                  onClick={e => this.handleDateRemoval(e, date)}
                />
              </div>
            )
          })}
        </div>
      )
    }
  }

  handleDateAddition = e => {
    e.preventDefault()
    this.props.addNotificationDate(this.props.type, this.state.tempDate)
    this.setState({ tempDate: '' })
  }

  handleDateRemoval = (e, date) => {
    e.preventDefault()
    this.props.removeNotificationDate(this.props.type, date)
  }

  render () {
    return (
      <div className={styles.accordion}>
        <Accordion>
          <AccordionTab header={this.props.header}>
            <p>{this.props.text}</p>
            <div className={styles.label}>Fechas a notificar</div>
            <Calendar
              locale={this.props.locale}
              showButtonBar
              value={this.state.tempDate}
              onChange={e => this.setState({ tempDate: e.value })}
              style={{ marginBottom: 20 }}
            />
            <Button
              style={{ marginLeft: 10 }}
              icon='pi pi-plus'
              tooltip='Agregar notificación'
              onClick={e => this.handleDateAddition(e)}
              disabled={!this.state.tempDate}
            />
            {this.renderSchedulledNotifications('email')}
          </AccordionTab>
        </Accordion>
      </div>
    )
  }
}
