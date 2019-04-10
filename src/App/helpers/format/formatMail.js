export default function(contactInformationEmail) {
  // eslint-disable-next-line no-useless-escape
  const reg = /^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (contactInformationEmail === '' || reg.test(String(contactInformationEmail).toLowerCase())) {
    return true
  } else {
    return 'Ingrese una dirección de email válido'
  }
}
