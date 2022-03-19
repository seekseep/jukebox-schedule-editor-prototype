import { useMemo } from 'react'
import { format, startOfWeek, add } from 'date-fns'
import ja from 'date-fns/locale/ja'
import { range } from 'lodash'

import { useEditor } from '../hooks'
import Piece from './Piece'

export default function WeeklyBoard () {
  const { teachers, current, currentWeeklyFrames, frameConditions } = useEditor()

  const dates = useMemo(() => {
    const firstDate = startOfWeek(current)
    return range(7).map(v => add(firstDate, { days: v }))
  }, [current])

  const frameHours = useMemo(() => {
    const firstDate = startOfWeek(current)
    return frameConditions.map((condition, index) => ({
      index,
      startedAt: add(firstDate, { days: index, ...condition.startDuration }),
      finishedAt: add(firstDate, { days: index, ...condition.startDuration })
    }))
  }, [frameConditions, current])

  return (
    <>
      <div className="flex sticky top-32 h-12">
        <div className="w-48 border-r border-b flex-shrink-0 bg-white z-[1001]" />
        {dates.map(date => (
          <div key={date.getTime()} className="flex flex-col w-48 flex-shrink-0 items-center border-r border-b bg-white">
            <div className="text-sm">{format(date, 'MM/dd')}</div>
            <div>{format(date, 'EEE', { locale: ja })}</div>
          </div>
        ))}
      </div>
      {teachers.map(teacher => (
        <div className="flex pr-52" key={teacher.id}>
          <div className="w-48 flex-shrink-0 border-b border-r-2 sticky top-64 left-0 bg-gray-50 shadow-lg flex items-start">
            <div className="p-4 text-sm flex-grow sticky top-32">{teacher.name}</div>
            <div>
              {frameHours.map(({ index, startedAt, finishedAt }) => (
                <div key={index}>
                  <div className='flex gap-1 text-sm h-32 border-b items-center px-1'>
                    <time>{format(startedAt, 'HH:mm')}</time>
                    <span>-</span>
                    <time>{format(finishedAt, 'HH:mm')}</time>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {currentWeeklyFrames.map((dailyFrames, i) => (
            <div key={i} className="w-48 flex-shrink-0 bg-gray-400">
              {dailyFrames.map(frame => <Piece className="h-32" key={frame.id} teacher={teacher} frame={frame} isBoard />)}
            </div>
          ))}
          <div className="w-52 border-b border-r flex-shrink-0" />
        </div>
      ))}
    </>
  )
}
