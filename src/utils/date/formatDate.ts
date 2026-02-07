import moment from 'moment'
import i18n from 'i18n'

const formatDate = (unix: any, { style = 'long', locale = i18n.getLocale() } = {}) => {
  if (!unix) return 'N/A'
  const m = moment.unix(unix).locale(locale)
  switch (style) {
    case 'short':
      return m.format('LLL') // Localized medium
    case 'full':
      return m.format('LLLL') // Localized long with weekday
    case 'date':
      return m.format('LL') // Date only
    case 'time':
      return m.format('LT') // Time only (localized)
    case 'compact24h':
      return m.format('YYYY-MM-DD HH:mm')
    case 'utc':
      return m.utc().format('YYYY-MM-DD HH:mm:ss [UTC]')
    case 'iso':
      return m.toISOString()
    case 'relative':
      return m.fromNow()
    case 'calendar':
      return m.calendar()
    default:
      return m.format('MMMM Do YYYY, h:mm:ss a') // Original style
  }
}

export default formatDate
