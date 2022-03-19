import classNames from 'classnames'
import { format } from 'date-fns'
import { BOARD_MODE } from '../../constants'
import { useEditor } from '../hooks'

function BoardModeButton ({ isActive, ...props }) {
  return (
    <button
      className={
        classNames(
          'rounded py-2 px-2',
          {
            'bg-blue-500 text-white': isActive,
            'bg-blue-50': !isActive
          }
        )
      }
      {...props} />
  )
}

export default function BoardNavigation () {
  const { current, setBoardMode, boardMode, goNext, goBack } = useEditor()

  return (
    <>
    <div className="h-16" />
    <div className="bg-white fixed top-16 left-0 right-52 border-b h-16 z-[1100]">
      <div className="p-2 flex gap-4 justify-between items-center">
      <div className="flex gap-2 items-center">
        <button onClick={goBack} className="w-10 h-10 bg-gray-100 p-2 rounded">⬅</button>
        <div className='p-2 w-32 text-lg text-center'>{format(current, 'yyyy/MM/dd')}</div>
        <button onClick={goNext} className="w-10 h-10 bg-gray-100 p-2 rounded">➡</button>
      </div>
      <div className='flex gap-1'>
        <BoardModeButton isActive={boardMode === BOARD_MODE.DAILY} onClick={() => setBoardMode(BOARD_MODE.DAILY)}>日毎</BoardModeButton>
        <BoardModeButton isActive={boardMode === BOARD_MODE.WEEKLY} onClick={() => setBoardMode(BOARD_MODE.WEEKLY)}>週毎</BoardModeButton>
      </div>
      </div>
    </div>
    </>
  )
}
