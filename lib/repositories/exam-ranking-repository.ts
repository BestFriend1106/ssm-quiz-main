import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { ExamRanking, UserExamResult } from 'domain/exams-ranking/exam-ranking-domain'

const EXAMS_RANKING_COLLECTION_NAME = 'exams-ranking'

const getExamRankingRef = (examId: string) => doc(db, EXAMS_RANKING_COLLECTION_NAME, `${examId}-ranking`)

const getExamRankingByExamId = async (examId: string): Promise<ExamRanking | null> => {
  const examRankingRef = getExamRankingRef(examId)
  const examRankingDocument = await getDoc(examRankingRef)
  if (!examRankingDocument.exists()) return null

  return plainToInstance(ExamRanking, examRankingDocument.data())
}

const getOrCreateExamRankingByExamId = async (examId: string): Promise<ExamRanking | null> => {
  const existingExamRanking = await getExamRankingByExamId(examId)
  if (existingExamRanking) {
    return existingExamRanking
  }

  const newExamRanking = plainToInstance(ExamRanking, {})

  const examRankingRef = getExamRankingRef(examId)
  await setDoc(examRankingRef, instanceToPlain(newExamRanking)).catch((error) => {
    console.error(`Error creating exam ranking for exam ID ${examId}: ${error}`)
    return null
  })

  return newExamRanking
}

const addUserExamResultToRanking = async ({
  examId,
  userResult,
}: {
  userResult: UserExamResult
  examId: string
}): Promise<ExamRanking | null> => {
  const existingExamRanking = await getOrCreateExamRankingByExamId(examId)
  if (!existingExamRanking) {
    console.error(`No ranking existing for exam with Id ${examId}`)
    return null
  }

  if (existingExamRanking.isUserAlreadyOnRanking(userResult.userId)) {
    console.warn('User is already on the ranking. Aborting!')
    return existingExamRanking
  }

  console.log('userResult', userResult)
  userResult.finishedExamAt = new Date()

  console.log('userResult2', userResult)
  existingExamRanking.addUserResult(userResult)
  await updateDoc(getExamRankingRef(examId), instanceToPlain(existingExamRanking))
  return existingExamRanking
}

export const ExamRankingRepository = {
  getExamRankingByExamId,
  getOrCreateExamRankingByExamId,
  addUserExamResultToRanking,
}
