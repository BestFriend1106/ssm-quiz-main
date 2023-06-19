import { Exclude, Expose, Transform, Type } from 'class-transformer'
import compareAsc from 'date-fns/compareAsc'
import { Timestamp, serverTimestamp } from 'firebase/firestore'

export class ExamRanking {
  @Type(() => UserExamResult)
  usersResults: UserExamResult[] = []

  @Exclude({ toPlainOnly: true })
  getRankingByPoints = () => {
    const resultsSortedByPoints = [...this.usersResults]
    resultsSortedByPoints.sort((result, nextResult) => {
      if (result.points !== nextResult.points) return nextResult.points - result.points
      return compareAsc(result.finishedExamAt, nextResult.finishedExamAt)
    })
    return resultsSortedByPoints
  }

  @Expose({ name: 'userOnRanking' })
  getUsersOnRanking = () => this.usersResults.map((result) => result.userId)

  @Exclude({ toPlainOnly: true })
  isUserAlreadyOnRanking = (userId: string) => {
    return this.getUsersOnRanking().includes(userId)
  }

  @Expose({ name: 'usersCount' })
  getUsersCount = () => this.getUsersOnRanking().length

  @Exclude({ toPlainOnly: true })
  addUserResult = (userResult: UserExamResult) => {
    if (this.isUserAlreadyOnRanking(userResult.userId)) return
    this.usersResults.push(userResult)
  }

  @Exclude({ toPlainOnly: true })
  getUserPositionOnRanking = (userId: string): number | undefined => {
    if (!this.isUserAlreadyOnRanking(userId)) return

    const userIndexOnRanking = this.getRankingByPoints().findIndex((userResult) => userResult.userId === userId)
    return userIndexOnRanking + 1
  }
}

export class UserExamResult {
  userId: string
  nickname: string
  profilePicture?: string

  @Transform(({ value }) => (value ? new Timestamp(value.seconds, value.nanoseconds).toDate() : undefined), {
    toClassOnly: true,
  })
  @Transform(({ value }) => (value ? Timestamp.fromDate(value) : Timestamp.fromDate(new Date())), { toPlainOnly: true })
  finishedExamAt: Date = new Date()

  points: number

  ssmSubject: string

  university: string

  city: string
}
