import moment from 'moment'

export default (date, format) => {
  format = format || 'DD-MM-YYYY'
  return moment(date).format(format)
}
