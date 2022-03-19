import { format } from 'date-fns'
import { useEditor } from '../hooks'
import Piece from './Piece'

export default function DailyBoard () {
  const { teachers, currentDailyFrames } = useEditor()
  return (
    <>
      <div className="flex sticky top-32 h-8">
        <div className="w-32 border-r border-b flex-shrink-0 bg-white z-[1001]" />
        {currentDailyFrames.map(frame => (
          <div key={frame.id} className="w-48 border-b border-r bg-white flex-shrink-0 text-center flex items-center justify-center">
            <div className='flex gap-1 text-sm'>
              <time>{format(frame.startedAt, 'HH:mm')}</time>
              <span>-</span>
              <time>{format(frame.finishedAt, 'HH:mm')}</time>
            </div>
          </div>
        ))}
      </div>
      {teachers.map(teacher => (
        <div className="flex pr-48 h-64" key={teacher.id}>
          <div className="w-32 flex-shrink-0 border-b border-r-2 sticky left-0 bg-gray-50 shadow-lg">
            <div className="p-4 text-sm sticky top-32">{teacher.name}</div>
          </div>
          {currentDailyFrames.map(frame => (
            <Piece key={frame.id} teacher={teacher} frame={frame} isBoard />
          ))}
          <div className="w-64 border-b border-r flex-shrink-0" />
        </div>
      ))}
    </>
  )
}
