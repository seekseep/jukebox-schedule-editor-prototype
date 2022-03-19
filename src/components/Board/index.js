import { useEditor } from '../hooks'

import { BOARD_MODE } from '../../constants'

import BoardNavigation from './BoardNavigation'
import DailyBoard from './DailyBoard'
import WeeklyBoard from './WeeklyBoard'

export default function Board () {
  const { boardMode } = useEditor()

  return (
    <>
      <BoardNavigation />
      {boardMode === BOARD_MODE.DAILY && <DailyBoard />}
      {boardMode === BOARD_MODE.WEEKLY && <WeeklyBoard />}
    </>
  )
}
