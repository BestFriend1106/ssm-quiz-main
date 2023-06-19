import {
  collection,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  collectionGroup,
  getDocs,
  where,
  limit,
} from 'firebase/firestore'
import { ExamFull } from 'domain/exams/exam-domain'
import { db } from '../firebase'
import { ADMIN_USER_COLLECTION_NAME } from './user-repository'
import { instanceToPlain, plainToInstance } from 'class-transformer'
const EXAMS_COLLECTION_NAME = 'exams'

const getAdminExamsCollection = (adminId: string) =>
  collection(db, ADMIN_USER_COLLECTION_NAME, adminId, EXAMS_COLLECTION_NAME)

const createExam = async (exam: ExamFull, adminId: string): Promise<ExamFull | null> => {
  const parsedExam = plainToInstance(ExamFull, exam)
  const now = serverTimestamp()
  const newExamData = { ...instanceToPlain(parsedExam), createdAt: now, updatedAt: now }
  return await setDoc(doc(db, ADMIN_USER_COLLECTION_NAME, adminId, EXAMS_COLLECTION_NAME, exam.id), newExamData)
    .then(() => exam)
    .catch((error) => {
      console.error('Error creating exam: ', error)
      return null
    })
}

const editExam = async (exam: ExamFull, adminId: string): Promise<void> => {
  const parsedExam = plainToInstance(ExamFull, exam)
  const now = serverTimestamp()
  const updatedData = { ...instanceToPlain(parsedExam), updatedAt: now }
  const docRef = doc(db, ADMIN_USER_COLLECTION_NAME, adminId, EXAMS_COLLECTION_NAME, exam.id)
  await setDoc(docRef, updatedData, { merge: true }).catch((error) => {
    console.error('Error updating exam: ', error)
    return null
  })
}

const deleteExam = async (exam: ExamFull, adminId: string): Promise<void> => {
  const docRef = doc(db, ADMIN_USER_COLLECTION_NAME, adminId, EXAMS_COLLECTION_NAME, exam.id)
  await deleteDoc(docRef)
}

const getAdminExamsSubscriptionQuery = (adminId: string = '') => {
  return query(getAdminExamsCollection(adminId), orderBy('updatedAt', 'desc'))
}

const getAppNewExamsQuery = ({
  examsCount,
  orderByField = 'createdAt',
  filterByDiscipline,
  filterByItem,
}: {
  examsCount?: number
  orderByField?: 'createdAt' | 'updatedAt'
  filterByDiscipline?: string
  filterByItem?: string
}) => {
  const queryConstraints = [orderBy(orderByField, 'desc')]
  if (!!filterByDiscipline) queryConstraints.push(where('disciplines', 'array-contains', filterByDiscipline))
  if (!!filterByItem) queryConstraints.push(where('items', 'array-contains', filterByItem))
  if (examsCount) queryConstraints.push(limit(examsCount))
  const examsQuery = query(collectionGroup(db, 'exams'), ...queryConstraints)
  return examsQuery
}

const getAppExamRef = async (examId: string) => {
  const examQuery = query(collectionGroup(db, 'exams'), where('id', '==', examId))
  const examsRefs = await getDocs(examQuery).then((snapshot) => snapshot.docs.map((document) => document.ref))
  if (examsRefs.length > 0) return plainToInstance(ExamFull, examsRefs[0])
}

const getAppExam = async (examId: string) => {
  const examQuery = query(collectionGroup(db, 'exams'), where('id', '==', examId))
  const exams = await getDocs(examQuery).then((snapshot) => snapshot.docs.map((document) => document.data()))
  if (exams.length > 0) return plainToInstance(ExamFull, exams[0])
}

export const ExamRepository = {
  getAdminExamsSubscriptionQuery,
  getAppNewExamsQuery,
  createExam,
  editExam,
  deleteExam,
  getAppExamRef,
  getAppExam,
}
