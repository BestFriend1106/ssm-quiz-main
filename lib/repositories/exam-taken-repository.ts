import {
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  updateDoc,
  getDoc,
  limit,
  getDocs,
} from 'firebase/firestore'
import { ExamFull, ExamTaken } from 'domain/exams/exam-domain'
import { QuestionWithAnswer } from 'domain/question'
import { db } from '../firebase'
import { USER_COLLECTION_NAME } from './user-repository'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { uuidv4 } from '@firebase/util'
const EXAMS_TAKEN_COLLECTION_NAME = 'exams-taken'

const getUserExamsTakenCollection = (userId: string) =>
  collection(db, USER_COLLECTION_NAME, userId, EXAMS_TAKEN_COLLECTION_NAME)

const getExamTakenByIdForUser = async (examTakenId: string, userId: string) => {
  const examTakenRef = doc(getUserExamsTakenCollection(userId), examTakenId)
  const examTakenSnapshot = await getDoc(examTakenRef)
  if (!examTakenSnapshot.exists()) {
    console.error('Error fetching created exam taken. Not existing')
    return null
  }
  return plainToInstance(ExamTaken, examTakenSnapshot.data())
}

const getLastExamTakenForUserOnExamId = async (examId: string, userId: string): Promise<ExamTaken | undefined> => {
  const lastExamTakenQuery = query(
    getUserExamsTakenCollection(userId),
    where('examId', '==', examId),
    orderBy('createdAt', 'desc'),
    limit(1)
  )
  const querySnapshot = await getDocs(lastExamTakenQuery)
  const [lastExamTaken] = querySnapshot.docs.map((document) => plainToInstance(ExamTaken, document.data()))
  return lastExamTaken
}

const getExamsTakenForUserOnExamIdQuery = (examId?: string, userId?: string) => {
  if (!examId || !userId) return
  return query(getUserExamsTakenCollection(userId), where('examId', '==', examId), orderBy('createdAt', 'desc'))
}

const createExamTaken = async ({
  exam,
  userId,
  userNickname,
}: {
  exam: ExamFull
  userId: string
  userNickname?: string
}): Promise<ExamTaken | null> => {
  const now = serverTimestamp()
  const { questions: examQuestions, id, ...examRemainingFields } = instanceToPlain(exam)
  const questionsWithEmptyAnswer: QuestionWithAnswer[] = [...examQuestions].map((question) => ({
    ...question,
    answer: undefined,
  }))
  const newExamTakenId = uuidv4()
  const newExamTakenData = {
    id: newExamTakenId,
    examId: id,
    userId,
    userNickname,
    ...examRemainingFields,
    questions: questionsWithEmptyAnswer,
    createdAt: now,
    updatedAt: now,
  }

  const newExamTakenRef = doc(getUserExamsTakenCollection(userId), newExamTakenId)
  await setDoc(newExamTakenRef, newExamTakenData).catch((error) => {
    console.error('Error creating exam taken: ', error)
    return null
  })

  const newExamTakenSnapshot = await getDoc(newExamTakenRef)
  if (!newExamTakenSnapshot.exists()) {
    console.error('Error fetching created exam taken. Not existing')
    return null
  }

  const examTakenInstance = plainToInstance(ExamTaken, newExamTakenSnapshot.data())
  if (examTakenInstance.createdAt) {
    examTakenInstance.endAt = new Date(examTakenInstance.createdAt)
    examTakenInstance.endAt.setMinutes(examTakenInstance.endAt.getMinutes() + examTakenInstance.duration)
  }
  setDoc(newExamTakenRef, instanceToPlain(examTakenInstance)).catch((error) => {
    console.error('Error updating EndAt field for exam taken: ', error)
    return null
  })
  return examTakenInstance
}

const updateQuestionsAnswers = async (examQuestions: QuestionWithAnswer[], examTakenId: string, userId: string) => {
  const now = serverTimestamp()
  const examTakenDataToUpdate = { questions: instanceToPlain(examQuestions), updatedAt: now }
  const docRef = doc(getUserExamsTakenCollection(userId), examTakenId)
  await updateDoc(docRef, examTakenDataToUpdate).catch((error) => {
    console.error('Error updating exam: ', error)
    return null
  })
}

const finishExam = async (
  examTakenId: string,
  userId: string,
  questions: QuestionWithAnswer[],
  totalPoints: number
) => {
  const examTakenRef = doc(getUserExamsTakenCollection(userId), examTakenId)
  await setDoc(
    examTakenRef,
    { questions: instanceToPlain(questions), isFinished: true, finalScore: totalPoints, updatedAt: serverTimestamp() },
    { merge: true }
  )
}

export const ExamTakenRepository = {
  getLastExamTakenForUserOnExamId,
  getExamsTakenForUserOnExamIdQuery,
  getExamTakenByIdForUser,
  createExamTaken,
  updateQuestionsAnswers,
  finishExam,
}
