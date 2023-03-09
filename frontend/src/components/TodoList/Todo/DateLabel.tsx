import React from 'react'
import clsx from 'clsx'
import { pipe } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import { makeDate } from '../../../common/types'

function formatedDateStr(str: string): string {
  return pipe(
    makeDate(str),
    E.match(
      () => '',
      (d) => `${d.getMonth()+1}/${d.getDay()}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds()}`
    )
  )
}

interface DateLabelProps {
  className?: string
  dateStr: string
}

const DateLabel: React.FC<DateLabelProps> = (props) => {
  const {
    className,
    dateStr,
  } = props

  return (
    <div className={clsx('font-size-1', 'font-color-gray', className)}>
      {formatedDateStr(dateStr)}
    </div>
  )
}

export default DateLabel
