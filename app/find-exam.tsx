import React, { useState } from 'react'
import { ExamFull } from 'domain/exams/exam-domain'
import { useNewExams } from 'domain/exams/use-new-exams'
import { Routes } from 'lib/utils/routes'
import { useRouter } from 'next/router'
import ExamCard from 'shared/card/exam'
import LoadingSpinner from 'shared/icon/loading-spinner'
import AutocompleteRawInput from 'shared/input/autocomplete-input-raw'
import { disciplines, items } from 'lib/utils/constants'

const FindExamsPage = () => {
  const router = useRouter()
  const [disciplineFilter, setDisciplineFilter] = useState('')
  const [itemFilter, setItemFilter] = useState('')

  const { newExams, isLoadingNewExams } = useNewExams({
    count: 30,
    filterByDiscipline: disciplineFilter,
    filterByItem: itemFilter,
  })

  const onClickExam = (examId: string) => router.push(`${Routes.appExams}/${examId}`)

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 px-8 mb-4 gap-x-8 gap-y-2 md:grid-cols-2">
        <AutocompleteRawInput
          options={disciplines}
          value={disciplineFilter ?? ''}
          onChange={(newValue) => {
            setDisciplineFilter(newValue)
            setItemFilter('')
          }}
          placeholder={'Filtra per disciplina'}
        />
        <AutocompleteRawInput
          options={items}
          value={itemFilter ?? ''}
          onChange={(newValue) => {
            setItemFilter(newValue)
            setDisciplineFilter('')
          }}
          placeholder={'Filtra per tema'}
        />
      </div>
      {newExams.length === 0 && (
        <div className="grid p-2 place-items-center">
          {isLoadingNewExams ? <LoadingSpinner size={12} /> : 'Nessun esame disponibile'}
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-2 pt-2 pb-4">
        {newExams.map((exam: ExamFull) => (
          <ExamCard
            key={exam.id}
            title={exam.title}
            description={exam.description}
            duration={exam.duration}
            questionsCount={exam.questions.length}
            disciplines={exam.getDisciplines()}
            onClick={() => onClickExam(exam.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default FindExamsPage
