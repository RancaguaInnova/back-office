export default function(rut) {
  var actual = rut.replace(/^0+/, '')
  if (actual !== '' && actual.length > 1) {
    var sinPuntos = actual.replace(/\./g, '')
    var actualLimpio = sinPuntos.replace(/-/g, '')
    var inicio = actualLimpio.substring(0, actualLimpio.length - 1)
    var rutPuntos = ''
    var i = 0
    var j = 1
    for (i = inicio.length - 1; i >= 0; i--) {
      var letra = inicio.charAt(i)
      rutPuntos = letra + rutPuntos
      if (j % 3 === 0 && j <= inicio.length - 1) {
        rutPuntos = '.' + rutPuntos
      }
      j++
    }
    var dv = actualLimpio.substring(actualLimpio.length - 1)
    rutPuntos = rutPuntos + '-' + dv
  }
  return rutPuntos
}
