export default {
  stringTooShort: ({ label, value }) => `${label} no tiene el largo suficiente`,
  notInSchema: ({ label, value }) => `${label} no esta permitido`,
  required: ({ label, value }) => `${label} es obligatorio`,
  unknownFieldType: ({ label, value }) => `${label} tiene un tipo desconocido`,
  notAnArray: ({ label, value }) => `${label} no es un arreglo`,
  notAnObject: ({ label, value }) => `${label} no es un objeto`,
  notAString: ({ label, value }) => `${label} no es de tipo texto`,
  notADate: ({ label, value }) => `${label} no es una fecha valida`,
  notAnInteger: ({ label, value }) => `${label} no es un nuúmero entero`,
  notANumber: ({ label, value }) => `${label} no es un número`,
  notAnId: ({ label, value }) => `${label} no es un ID válido`,
  stringTooLong: ({ label, value }) => `El largo es mayor al permitido`,
  numberTooSmall: ({ label, value }) => `${label} es un número muy pequeño`,
  numberTooBig: ({ label, value }) => `${label} es un número muy grande`,
  notABoolean: ({ label, value }) =>
    `${label} no es un valor verdadero o falso`,
  notAnEmail: ({ label, value }) => `${label} no es un email`,
  notUnique: ({ label, value }) => `${label} no es único`,
  notFound: ({ label, value }) => `${label} no se encontró`
}
