export default function(lahora) {
  if (lahora !== '') {
    var arrHora = lahora.split(':')

    if (arrHora.length !== 2) {
      return false
    }

    if (parseInt(arrHora[0]) < 0 || parseInt(arrHora[0]) > 23) {
      return false
    }

    if (parseInt(arrHora[1]) < 0 || parseInt(arrHora[1]) > 59) {
      return false
    }

    return true
  } else {
    return false
  }
}
