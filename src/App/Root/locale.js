import numeral from 'numeral'
import moment from 'moment'

/*
import 'numeral/locales/es'
import 'moment/locale/es'
*/

moment.locale('es')
numeral.locale('es')

global.numeral = numeral
global.moment = moment
