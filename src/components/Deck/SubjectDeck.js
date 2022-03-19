import { useMemo, useState, useCallback } from 'react'
import { useEditor } from '../hooks'

import LessonBlock from '../LessonBlock'

export default function SubjectDeck () {
  const { subjects, setTeacherAndFrameToLesson } = useEditor()
  const [filter, setFilter] = useState('unsettled')

  const filteredSubjects = useMemo(() => {
    if (filter === 'all') return subjects

    return subjects.map((subject) => ({
      ...subject,
      lessons: subject.lessons.filter(lesson => !lesson.frame)
    })).filter(subject => subject.lessons.length > 0)
  }, [subjects, filter])

  const handleDrop = useCallback(({ nativeEvent: { dataTransfer } }) => {
    dataTransfer.items[0].getAsString(json => {
      const lesson = JSON.parse(json)
      setTeacherAndFrameToLesson(lesson.id, null, null)
    })
  }, [])

  const handleDragOver = useCallback(event => {
    event.preventDefault()
  }, [])

  const handleDragLeave = useCallback(event => {
  }, [])

  return (
    <div onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className="fixed right-0 top-[4rem] bottom-0 w-52 border-l-2 bg-white shadow-xl flex flex-col z-[1001]">
      <div className="p-2 bg-gray-50 flex flex-col gap-2">
        <div className="text-lg">授業</div>
        <select className="bg-white rounded border p-2" value={filter} onChange={({ target: { value: filter } }) => setFilter(filter)}>
          <option value="unsettled">未確定</option>
          <option value="all">すべて</option>
        </select>
      </div>
      <div className="flex flex-col flex-grow overflow-auto gap-4 pt-4">
        {filteredSubjects.map(subject => (
          <div key={subject.id} className="flex flex-col gap-2">
            <div className="px-3 text-sm text-gray-500">{subject.name}</div>
            <div className="px-4 flex flex-col gap-2">
              {subject.lessons.map(lesson => <LessonBlock key={lesson.id} lesson={lesson} isDeck />)}
            </div>
          </div>
        ))}
        <div className="h-16" />
      </div>
    </div>
  )
}
