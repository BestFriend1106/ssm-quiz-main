import { Exclude, Expose, Transform, Type } from 'class-transformer'
import { QuestionFull, QuestionWithAnswer } from '../question'
import { Timestamp } from 'firebase/firestore'
import compareAsc from 'date-fns/compareAsc'
import { itemsDisciplines } from 'lib/utils/constants'
export class Exam {
  title: string
  description: string

  @Transform(({ value }) => (value ? new Timestamp(value.seconds, value.nanoseconds).toDate() : undefined), {
    toClassOnly: true,
  })
  @Transform(({ value }) => (value ? Timestamp.fromDate(value) : undefined), { toPlainOnly: true })
  createdAt?: Date

  @Transform(({ value }) => (value ? new Timestamp(value.seconds, value.nanoseconds).toDate() : undefined), {
    toClassOnly: true,
  })
  @Transform(({ value }) => (value ? Timestamp.fromDate(value) : undefined), { toPlainOnly: true })
  updatedAt?: Date

  @Type(() => Number)
  duration: number

  @Type(() => QuestionFull)
  questions: QuestionFull[]

  @Expose({ name: 'items' })
  getItems = () => this.questions.map((question) => question.item).filter((item) => !!item)

  @Expose({ name: 'disciplines' })
  getDisciplines = () => {
    const disciplines = this.questions.flatMap((question) => (question.item ? itemsDisciplines[question.item] : []))
    const uniqueDisciplines = new Set(disciplines).values()
    return [...uniqueDisciplines]
  }
}

export class ExamFull extends Exam {
  id: string
}

export const CORRECT_ANSWER_POINTS = 1
export const INCORRECT_ANSWER_POINTS = -0.25
export const DONT_KNOW_ANSWER_POINTS = 0

export class ExamTaken extends ExamFull {
  examId: string
  userId: string

  @Transform(({ value }) => (value ? new Timestamp(value.seconds, value.nanoseconds).toDate() : undefined), {
    toClassOnly: true,
  })
  @Transform(({ value }) => (value ? Timestamp.fromDate(value) : undefined), { toPlainOnly: true })
  endAt?: Date

  @Type(() => QuestionWithAnswer)
  questions: QuestionWithAnswer[]

  @Transform(({ value }) => (value === undefined ? false : value))
  isFinished?: boolean

  finalScore?: number

  @Exclude({ toPlainOnly: true })
  totalPoints = () => {
    const totalPoints = this.questions.reduce<number>((totalPoints, question) => {
      totalPoints += question.getPoints()
      return totalPoints
    }, 0)

    return totalPoints
  }

  @Exclude({ toPlainOnly: true })
  totalQuestionsWithoutAnswer = () => {
    const totalQuestionsCount = this.questions.reduce<number>((countOfQuestionsWithoutAnswer, question) => {
      if (!question.hasValidAnswer()) {
        countOfQuestionsWithoutAnswer += 1
      }
      return countOfQuestionsWithoutAnswer
    }, 0)

    return totalQuestionsCount
  }

  @Exclude({ toPlainOnly: true })
  isStillRunning = () => {
    if (this.isFinished || typeof this.finalScore === 'number') return false
    if (!this.endAt) return true

    const isExamTimeEnded = compareAsc(this.endAt, Date.now()) === -1
    return !isExamTimeEnded
  }

  @Exclude({ toPlainOnly: true })
  getExamScore = () => this.finalScore ?? this.totalPoints() ?? 0
}
