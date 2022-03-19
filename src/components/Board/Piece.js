import classNames from 'classnames'
import { useCallback, useState } from 'react'
// import classNames from 'classnames'
import {
  useEditor,
  useLesonsByTeacherAndFrame
} from '../hooks'

import LessonBlock from '../LessonBlock'

export default function Piece ({ teacher, frame, className }) {
  const [{ isActive }, setState] = useState({ isActive: false })
  const { setTeacherAndFrameToLesson } = useEditor()
  const lessons = useLesonsByTeacherAndFrame(teacher.id, frame.id)

  const handleDrop = useCallback(({ nativeEvent: { dataTransfer } }) => {
    setState(state => ({ ...state, isActive: false }))
    dataTransfer.items[0].getAsString(json => {
      const lesson = JSON.parse(json)
      setTeacherAndFrameToLesson(lesson.id, teacher.id, frame.id)
    })
  }, [])

  const handleDragOver = useCallback(event => {
    event.preventDefault()
    setState(state => ({ ...state, isActive: true }))
  }, [])

  const handleDragLeave = useCallback(event => {
    setState(state => ({ ...state, isActive: false }))
  }, [])

  return (
    <div
      onDrop={handleDrop} onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={
        classNames(
          'w-48 border-b border-r flex-shrink-0 p-2 bg-gray-50 flex flex-col gap-2 overflow-auto',
          { 'bg-gray-100': isActive },
          className
        )
      }>
      {lessons.map(lesson => <LessonBlock key={lesson.id} lesson={lesson} isBoard />)}
    </div>
  )
}
