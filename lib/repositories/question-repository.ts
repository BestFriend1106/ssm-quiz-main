import {
  collection,
  deleteDoc,
  doc,
  endAt,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  setDoc,
  startAfter,
  startAt,
  where,
} from 'firebase/firestore'
import { QuestionFull } from 'domain/question'
import { db } from '../firebase'
import { ADMIN_USER_COLLECTION_NAME } from './user-repository'

const QUESTION_COLLECTION_NAME = `questions`

const getAdminQuestionsCollection = (adminId: string) =>
  collection(db, ADMIN_USER_COLLECTION_NAME, adminId, QUESTION_COLLECTION_NAME)

const createQuestion = async (question: QuestionFull, adminId: string): Promise<QuestionFull | null> => {
  const now = serverTimestamp()
  const newQuestionData = { ...question, createdAt: now, updatedAt: now }
  return await setDoc(
    doc(db, ADMIN_USER_COLLECTION_NAME, adminId, QUESTION_COLLECTION_NAME, question.id),
    newQuestionData
  )
    .then(() => question)
    .catch((error) => {
      console.error('Error creating question: ', error)
      return null
    })
}

const editQuestion = async (question: QuestionFull, adminId: string): Promise<void> => {
  const now = serverTimestamp()
  const updatedQuestionData = { ...question, updatedAt: now }
  const docRef = doc(db, ADMIN_USER_COLLECTION_NAME, adminId, QUESTION_COLLECTION_NAME, question.id)
  await setDoc(docRef, updatedQuestionData, { merge: true }).catch((error) => {
    console.error('Error updating question: ', error)
    return null
  })
}

const deleteQuestion = async (question: QuestionFull, adminId: string): Promise<void> => {
  const docRef = doc(db, ADMIN_USER_COLLECTION_NAME, adminId, QUESTION_COLLECTION_NAME, question.id)
  await deleteDoc(docRef)
}

const getAdminQuestionsSubscriptionQuery = (adminId: string = '') => {
  return query(getAdminQuestionsCollection(adminId), orderBy('updatedAt', 'desc'))
}

const getAdminQuestionsWithSearchQuery = ({
  searchTerm,
  adminId = '',
  startAfterSnapshot,
  fromItem,
}: {
  searchTerm?: string
  adminId?: string
  startAfterSnapshot?: QueryDocumentSnapshot
  fromItem?: string
}) => {
  const orderByFilter = searchTerm?.length ? orderBy('description') : orderBy('updatedAt', 'desc')
  const defaultFilters = [orderByFilter, limit(10)]

  const fromItemFilters = fromItem ? [where('item', '==', fromItem)] : []
  const searchTermFilters = searchTerm?.length ? [startAt(searchTerm), endAt(`${searchTerm}~`)] : []
  const startAfterSnapshotFilters = startAfterSnapshot ? [startAfter(startAfterSnapshot)] : []
  return query(
    getAdminQuestionsCollection(adminId),
    ...defaultFilters,
    ...searchTermFilters,
    ...fromItemFilters,
    ...startAfterSnapshotFilters
  )
}

export const QuestionRepository = {
  getAdminQuestionsSubscriptionQuery,
  getAdminQuestionsWithSearchQuery,
  createQuestion,
  editQuestion,
  deleteQuestion,
}
