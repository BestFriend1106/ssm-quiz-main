import { Exclude, Transform, Type } from 'class-transformer'
import { uuidv4 } from '@firebase/util'
import { CORRECT_ANSWER_POINTS, INCORRECT_ANSWER_POINTS } from './exams/exam-domain'

export enum QuestionType {
  Closed = 'Chiusa',
}

export class QuestionAlternative {
  @Transform(({ value }) => value ?? uuidv4())
  id?: string

  text: string
  isCorrect: boolean
}

export class QuestionFile {
  name: string
  url: string
  fullPath: string
  type?: string
  size?: number
}

class BaseQuestion {
  id: string
  description: string
  item?: string

  @Type(() => QuestionFile)
  images?: QuestionFile[]

  @Transform(({ value }) => value ?? QuestionType.Closed)
  type: QuestionType
}

export class Question extends BaseQuestion {
  alternatives: string[]
}

export class QuestionFull extends BaseQuestion {
  id: string

  isPublished: boolean

  @Type(() => QuestionAlternative)
  alternatives: QuestionAlternative[]

  correctionText?: string

  @Type(() => QuestionFile)
  correctionImages?: QuestionFile[]
}

export class QuestionWithAnswer extends QuestionFull {
  answer?: QuestionAlternative | null

  @Exclude({ toPlainOnly: true })
  getPoints = () => {
    if (this.answer === null || this.answer === undefined) return 0
    const totalPoints = this.answer.isCorrect ? CORRECT_ANSWER_POINTS : INCORRECT_ANSWER_POINTS
    return totalPoints
  }

  @Exclude({ toPlainOnly: true })
  hasValidAnswer = () => {
    const invalidAnswers: (typeof this.answer)[] = [null, undefined]
    return !invalidAnswers.includes(this.answer)
  }
}

export type FileDisplayProps = {
  file: Pick<QuestionFile, 'url' | 'name' | 'type' | 'size'>
  className?: string
  onClick?(): void
}
