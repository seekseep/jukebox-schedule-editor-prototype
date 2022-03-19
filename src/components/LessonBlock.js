import classNames from 'classnames'
import { useCallback, useState } from 'react'

export default function LessonBlock ({ lesson, isBoard = false, isDeck = false }) {
  const [{ isDragging }, setState] = useState({ isDragging: false })

  const handleDragStart = useCallback(({ nativeEvent: { dataTransfer } }) => {
    dataTransfer.dropEffect = 'move'
    dataTransfer.effectAllowed = 'move'
    dataTransfer.items.add(JSON.stringify(lesson), 'text/plain')
    setState(s => ({ ...s, isDragging: true }))
  }, [lesson])

  const handleDragEnd = useCallback(() => {
    setState(s => ({ ...s, isDragging: false }))
  }, [])

  const isDraggable = isBoard || (isDeck && !lesson.frame)

  return (
    <div
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={
        classNames(
          'border rounded w-40 bg-white p-1 shadow text-sm px-2',
          { 'opacity-50': isDragging || !isDraggable }
        )
      }>
      {lesson.name}
    </div>
  )
}
