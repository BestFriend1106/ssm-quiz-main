import { XMarkIcon } from '@heroicons/react/20/solid'
import { items, itemsDisciplines } from 'lib/utils/constants'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { useUserContext } from 'lib/userContext'
import SubmitButton from 'shared/button/submit'
import MultilineTextInput from 'shared/input/multiline-text-input'
import TextInput from 'shared/input/text-input'
import SectionTitle from 'shared/text/section-title'
import { ExamFull } from 'domain/exams/exam-domain'
import { ExamRepository } from 'lib/repositories/exam-repository'
import { ChangeEvent, useMemo, useState } from 'react'
import { useFirestoreInfiniteQuery } from '@react-query-firebase/firestore'
import { QuestionRepository } from 'lib/repositories/question-repository'
import { QuerySnapshot } from 'firebase/firestore'
import { QuestionFull } from 'domain/question'
import { ActionButtonSecondary } from 'shared/button/action'
import InputErrorMessage from 'shared/input/input-error-message'
import QuestionCard from './question-card'
import AutocompleteRawInput from 'shared/input/autocomplete-input-raw'
import InputLabel from 'shared/input/input-label'
import uniqBy from 'lodash/uniqBy'
import LoadingSpinner from 'shared/icon/loading-spinner'
import Body1 from 'shared/text/body2'
import { uuidv4 } from '@firebase/util'
import StaticTag from 'shared/card/static-tag'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import Tooltip from 'shared/overlay/tooltip'

const MINIMUM_NUMBER_OF_QUESTIONS = 2

type CreateOrEditExamPageProps = {
  exam: ExamFull | null
  onClose?(): void
}
const CreateOrEditExamPage = ({ exam, onClose }: CreateOrEditExamPageProps) => {
  const isCreateNewExam = !exam?.id
  const title = isCreateNewExam ? 'Nuovo' : 'Dettagli dell'
  const submitAction = isCreateNewExam ? 'Creare' : 'Salvare'
  const onSuccess = isCreateNewExam ? ExamRepository.createExam : ExamRepository.editExam
  return (
    <>
      <div className="flex items-center justify-between overflow-y-scroll">
        <SectionTitle>{title} esame</SectionTitle>
        <XMarkIcon className="w-8 h-8 cursor-pointer" onClick={onClose} />
      </div>
      <CreateOrEditExamForm exam={exam} submitAction={submitAction} onClose={onClose} onSuccess={onSuccess} />
    </>
  )
}

export default CreateOrEditExamPage

type CreateOrEditExamFormProps = CreateOrEditExamPageProps & {
  submitAction: string
  onSuccess: typeof ExamRepository.createExam | typeof ExamRepository.editExam
}

const CreateOrEditExamForm = ({ onClose, exam, onSuccess, submitAction }: CreateOrEditExamFormProps) => {
  const defaultValues = exam ? { ...exam } : {}

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ExamFull>({ defaultValues })

  const { firebaseUser } = useUserContext()

  const {
    fields: questionsFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({ name: 'questions', control })

  const selectedQuestions = useWatch({ control, name: 'questions', defaultValue: exam?.questions ?? [] })
  const selectedQuestionsIds = selectedQuestions.map((question) => question.id)
  const [questionsSearchTerm, setQuestionsSearchTerm] = useState('')
  const [questionsSearchItem, setQuestionsSearchItem] = useState<string>()
  const {
    data,
    isFetching: isFetchingQuestions,
    fetchNextPage,
  } = useFirestoreInfiniteQuery(
    ['questions', { questionsSearchTerm, questionsSearchItem }],
    QuestionRepository.getAdminQuestionsWithSearchQuery({
      searchTerm: questionsSearchTerm,
      adminId: firebaseUser?.uid,
      fromItem: questionsSearchItem,
    }),
    (snapshot: QuerySnapshot) => {
      const lastDocument = snapshot.docs[snapshot.docs.length - 1]
      return QuestionRepository.getAdminQuestionsWithSearchQuery({
        searchTerm: questionsSearchTerm,
        adminId: firebaseUser?.uid,
        startAfterSnapshot: lastDocument,
        fromItem: questionsSearchItem,
      })
    }
  )

  const rawQuestions = data?.pages.flatMap((group) => {
    return group.docs.map((questionSnapshot) => {
      const questionData = questionSnapshot.data() as QuestionFull
      return questionData
    })
  })
  const questions = uniqBy(rawQuestions, 'id').filter((question) => !selectedQuestionsIds.includes(question.id))
  const questionsCount = questions.length ?? 0

  const onSubmit = async (data: ExamFull) => {
    if (!firebaseUser?.uid) return

    if (data.questions.length < MINIMUM_NUMBER_OF_QUESTIONS) {
      setError('questions', { type: 'custom', message: `Seleziona almeno ${MINIMUM_NUMBER_OF_QUESTIONS} domande` })
      return
    }

    const examData = { ...data }
    examData.id = exam?.id ?? uuidv4()
    const createdOrUpdatedExam = await onSuccess(examData, firebaseUser.uid)
    if (exam || createdOrUpdatedExam) onClose?.()
  }

  const examDisciplines = useMemo(() => {
    const disciplines = selectedQuestions.flatMap((question) => (question.item ? itemsDisciplines[question.item] : []))
    const uniqueDisciplines = new Set(disciplines).values()
    return [...uniqueDisciplines]
  }, [selectedQuestions])

  return (
    <>
      <form
        className="grid grid-cols-[1fr] md:grid-cols-[1fr_1fr] p-2 md:px-10 gap-y-4 gap-x-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <SectionTitle className="col-start-1 font-normal ">Esami</SectionTitle>
        <TextInput
          type="number"
          label="Durata (in minuti)"
          className="w-1/2 col-start-1"
          aria-label="Durata"
          placeholder="Durata dell'esame..."
          errorMessage={errors.duration?.message}
          {...register('duration', {
            required: 'La durata è richiesta',
          })}
        />
        <TextInput
          label="Titolo"
          className="col-start-1"
          aria-label="Titolo"
          placeholder="Titolo dell'esame..."
          errorMessage={errors.title?.message}
          {...register('title', {
            required: 'Il titolo è richiesto',
          })}
        />
        <MultilineTextInput
          label="Descrizione"
          rows={4}
          className="col-start-1 md:col-span-2"
          aria-label="Descrizione"
          placeholder="Descrizione dell'esame..."
          errorMessage={errors.description?.message}
          {...register('description', {
            required: 'La descrizione è richiesta',
          })}
        />
        <InputLabel className="flex flex-col justify-center col-span-2">
          <div className="inline-flex">
            Disciplines
            <Tooltip content="le discipline sono definite in base alle domande aggiunte all'esame">
              <InformationCircleIcon className="self-start inline w-4 h-4 ml-1 -translate-y-[0.1rem] text-slate-400" />
            </Tooltip>
          </div>
          <div className="flex flex-wrap items-center mt-1 ml-2 gap-x-1">
            {examDisciplines.map((discipline) => (
              <StaticTag key={discipline}>{discipline}</StaticTag>
            ))}
          </div>
        </InputLabel>
        <SectionTitle className="col-start-1 font-normal ">Domande</SectionTitle>
        {questionsFields.length > 0 && (
          <div className="col-span-2 col-start-1">
            {selectedQuestions?.map((field, index) => (
              <QuestionCard
                key={field.id}
                description={field.description}
                type={field.type}
                item={field.item}
                className="mb-2 mr-4"
                onDelete={() => removeQuestion(index)}
              />
            ))}
          </div>
        )}
        <InputLabel className="col-span-2 col-start-1">Cerca le domande in base a uno dei filtri: </InputLabel>
        <div className="flex items-center flex-grow col-span-2">
          <InputLabel>Titolo: </InputLabel>
          <TextInput
            value={questionsSearchTerm}
            autoFocus={false}
            className="w-full ml-2"
            inputClassName="rounded-full border-slate-500 border-2 shadow-slate-300"
            aria-label="Cerca domanda"
            placeholder="Titolo della domanda da cercare..."
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setQuestionsSearchTerm(event.target.value)
              setQuestionsSearchItem(undefined)
            }}
          />
          <XMarkIcon
            className="w-6 h-6 ml-2 cursor-pointer text-slate-500"
            onClick={() => setQuestionsSearchTerm('')}
          />
        </div>
        <div className="flex items-center flex-grow col-span-2">
          <InputLabel>Item: </InputLabel>
          <AutocompleteRawInput
            value={questionsSearchItem ?? ''}
            onChange={(value) => {
              setQuestionsSearchItem(value as string)
              setQuestionsSearchTerm('')
            }}
            options={items}
            className="w-full ml-2"
            aria-label="Item"
            placeholder="Item della domanda da cercare..."
          />
          <XMarkIcon
            className="w-6 h-6 ml-2 cursor-pointer text-slate-500"
            onClick={() => setQuestionsSearchItem(undefined)}
          />
        </div>
        {errors.questions?.message && (
          <InputErrorMessage className="col-start-1" errorMessage={errors.questions?.message} />
        )}
        {isFetchingQuestions && questionsCount == 0 && (
          <div className="flex justify-center col-span-2">
            <LoadingSpinner className="fill-blue-500" />
          </div>
        )}
        {!isFetchingQuestions && questionsCount == 0 && (
          <Body1 className="w-full col-span-2 text-center">Nessuna domanda trovata</Body1>
        )}
        <div className="flex flex-col w-3/4 col-span-2 col-start-1 text-black">
          {questions?.map((question) => (
            <QuestionCard
              key={question.id}
              description={question.description}
              type={question.type}
              item={question.item}
              className="mb-2"
              cardClassName="border-dashed"
              onClick={() => {
                clearErrors('questions')
                appendQuestion(question)
              }}
            />
          ))}
          {questionsCount + selectedQuestions.length >= 10 && (
            <ActionButtonSecondary isLoading={isFetchingQuestions} className="mt-2" onClick={() => fetchNextPage()}>
              Carica più domande
            </ActionButtonSecondary>
          )}
        </div>

        <SubmitButton isLoading={isSubmitting} className="col-span-2 mt-4">
          {submitAction}
        </SubmitButton>
      </form>
    </>
  )
}
