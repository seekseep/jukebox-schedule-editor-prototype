import { uniqueId, range } from 'lodash'
import { useCallback, useMemo, useState, createContext, useContext } from 'react'
import {
  getDate,
  add, sub,
  lastDayOfMonth,
  startOfDay,
  endOfDay,
  startOfWeek
} from 'date-fns'

import { BOARD_MODE } from '../constants'

function getDefaultState () {
  const students = [
    { id: uniqueId('student_'), name: '磯野ワカメ' },
    { id: uniqueId('student_'), name: '磯野カツオ' }
  ]

  const teachers = [
    { id: uniqueId('teacher_'), name: '田中先生' },
    { id: uniqueId('teacher_'), name: '鈴木先生' },
    { id: uniqueId('teacher_'), name: '森田先生' },
    { id: uniqueId('teacher_'), name: '木村先生' }
  ]

  const frameConditions = [
    {
      startDuration: { hours: 13, minutes: 0 },
      finishDuration: { hours: 13, minutes: 55 }
    }, {
      startDuration: { hours: 14, minutes: 0 },
      finishDuration: { hours: 14, minutes: 55 }
    }, {
      startDuration: { hours: 15, minutes: 0 },
      finishDuration: { hours: 15, minutes: 55 }
    }, {
      startDuration: { hours: 16, minutes: 0 },
      finishDuration: { hours: 16, minutes: 55 }
    }, {
      startDuration: { hours: 17, minutes: 0 },
      finishDuration: { hours: 17, minutes: 55 }
    }, {
      startDuration: { hours: 18, minutes: 0 },
      finishDuration: { hours: 18, minutes: 55 }
    }, {
      startDuration: { hours: 19, minutes: 0 },
      finishDuration: { hours: 19, minutes: 55 }
    }, {
      startDuration: { hours: 20, minutes: 0 },
      finishDuration: { hours: 20, minutes: 55 }
    }]

  const firstDay = new Date('2022/03/01 00:00')
  const lastDay = lastDayOfMonth(firstDay)

  const frames = []
  range(0, getDate(lastDay)).forEach(number => {
    frameConditions.forEach(condition => {
      frames.push({
        id: uniqueId('frame_'),
        startedAt: add(firstDay, { days: number, ...condition.startDuration }),
        finishedAt: add(firstDay, { days: number, ...condition.finishDuration })
      })
    })
  })

  const subjects = [{
    id: uniqueId('subject_'),
    name: '個人英語授業',
    students: [students[0].id],
    lessons: [
      {
        id: uniqueId('lesson_'),
        name: '個人英語授業 1',
        teachers: [teachers[0].id],
        frame: frames[0].id
      },
      { id: uniqueId('lesson_'), name: '個人英語授業 2', teachers: [], frame: null },
      { id: uniqueId('lesson_'), name: '個人英語授業 3', teachers: [], frame: null },
      { id: uniqueId('lesson_'), name: '個人英語授業 4', teachers: [], frame: null }
    ]
  }, {
    id: uniqueId('subject_'),
    name: '個人数学授業',
    students: [students[1].id],
    lessons: [
      { id: uniqueId('lesson_'), name: '個人数学授業 1', teachers: [], frame: null },
      { id: uniqueId('lesson_'), name: '個人数学授業 2', teachers: [], frame: null },
      { id: uniqueId('lesson_'), name: '個人数学授業 3', teachers: [], frame: null },
      { id: uniqueId('lesson_'), name: '個人数学授業 4', teachers: [], frame: null }
    ]
  }, {
    id: uniqueId('subject_'),
    name: '特別講習',
    students: [students[0].id, students[1].id],
    lessons: [
      { id: uniqueId('lesson_'), name: '特別講習 1', teachers: [], frame: null },
      { id: uniqueId('lesson_'), name: '特別講習 2', teachers: [], frame: null },
      { id: uniqueId('lesson_'), name: '特別講習 3', teachers: [], frame: null },
      { id: uniqueId('lesson_'), name: '特別講習 4', teachers: [], frame: null },
      { id: uniqueId('lesson_'), name: '特別講習 5', teachers: [], frame: null },
      { id: uniqueId('lesson_'), name: '特別講習 6', teachers: [], frame: null },
      { id: uniqueId('lesson_'), name: '特別講習 7', teachers: [], frame: null }
    ]
  }]

  return {
    current: new Date(2022, 2, 1),
    students,
    teachers,
    frames,
    frameConditions,
    subjects,
    boardMode: BOARD_MODE.DAILY
  }
}

const Context = createContext()

export function useEditor () {
  return useContext(Context)
}

export function Provider (props) {
  const [{
    current,
    students,
    teachers,
    frames,
    subjects,
    boardMode,
    frameConditions
  }, setState] = useState(getDefaultState())

  const currentDailyFrames = useMemo(() => frames.filter(
    frame => startOfDay(current) <= frame.startedAt && frame.finishedAt <= endOfDay(current)
  ), [frames, current])

  const currentWeeklyFrames = useMemo(() => {
    const firstDate = startOfWeek(current)
    return range(7).map(index => {
      const date = add(firstDate, { days: index })
      return frames.filter(frame => startOfDay(date) <= frame.startedAt && frame.finishedAt <= endOfDay(date))
    })
  }, [frames, current])

  const goBack = useCallback(() => {
    setState(state => ({
      ...state,
      current: state.boardMode === BOARD_MODE.DAILY ? sub(state.current, { days: 1 }) : sub(state.current, { weeks: 1 })
    }))
  }, [])

  const goNext = useCallback(() => {
    setState(state => ({
      ...state,
      current: state.boardMode === BOARD_MODE.DAILY ? add(state.current, { days: 1 }) : add(state.current, { weeks: 1 })
    }))
  }, [])

  const setBoardMode = useCallback((boardMode) => {
    if (boardMode === BOARD_MODE.WEEKLY) {
      setState(s => ({
        ...s,
        current: startOfWeek(s.current),
        boardMode
      }))
      return
    }

    setState(s => ({ ...s, boardMode }))
  }, [])

  const setTeacherAndFrameToLesson = useCallback((lessonId, teacherId, frameId) => {
    setState(state => {
      const subjects = state.subjects.map(subject => {
        return {
          ...subject,
          lessons: subject.lessons.map(lesson => {
            if (lesson.id !== lessonId) return { ...lesson }
            return {
              ...lesson,
              teachers: [teacherId],
              frame: frameId
            }
          })
        }
      })

      return { ...state, subjects }
    })
  }, [])

  return <Context.Provider value={{
    current,
    currentDailyFrames,
    currentWeeklyFrames,
    students,
    teachers,
    frames,
    subjects,
    boardMode,
    frameConditions,
    setBoardMode,
    goBack,
    goNext,
    setTeacherAndFrameToLesson
  }} {...props} />
}

export function useLesonsByTeacherAndFrame (teacherId, frameId) {
  const { subjects } = useEditor()

  return useMemo(() => subjects.reduce(
    (lessons, subject) => subject.lessons.reduce((lessons, lesson) => {
      if (
        lesson.frame === frameId &&
        lesson.teachers.some(teacher => teacher === teacherId)
      ) {
        return [...lessons, lesson]
      }
      return lessons
    }, lessons), []), [teacherId, frameId, subjects])
}
