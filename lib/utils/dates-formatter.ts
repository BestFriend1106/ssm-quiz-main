import format from 'date-fns/format'
import itLocale from 'date-fns/locale/it'

type DateFormat = 'time' | 'human_readable_date' | 'human_readable_datetime'

const dateFormatToDateFnsFormatMapping: Record<DateFormat, string> = {
  time: 'p',
  human_readable_date: 'PP',
  human_readable_datetime: 'PP - p',
}
export const formatDate = (date: Date, dateFormat: DateFormat) => {
  const dateFnsFormat = dateFormatToDateFnsFormatMapping[dateFormat]
  return format(date, dateFnsFormat, { locale: itLocale })
}
