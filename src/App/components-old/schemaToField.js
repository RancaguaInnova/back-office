import ArrayComponent from 'orionsoft-parts/lib/components/fields/ArrayComponent'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import NumberField from 'orionsoft-parts/lib/components/fields/numeral/Number'
import DateText from 'orionsoft-parts/lib/components/fields/DateText'
import Toggle from 'orionsoft-parts/lib/components/fields/Toggle'
import ObjectField from './fields/ObjectField'
import Relation from './fields/Relation'
import isArray from 'lodash/isArray'

const singleFieldMap = {
  email: Text,
  string: Text,
  ID: Text,
  integer: NumberField,
  number: NumberField,
  array: ArrayComponent,
  plainObject: ObjectField,
  boolean: Toggle,
  date: DateText,
  relation: Relation
}

const arrayFieldMap = {}

export default function (type) {
  const fieldMap = isArray(type) ? arrayFieldMap : singleFieldMap
  const typeId = isArray(type) ? type[0] : type
  const fieldType = fieldMap[type]
  if (!fieldType) {
    const text = isArray(type) ? `[${typeId}]` : typeId
    throw new Error('No field component for type: ' + text)
  }
  return fieldType
}
