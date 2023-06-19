import { QuestionWithAnswer } from 'domain/question'
import React from 'react'
import FileDisplayCard from 'shared/card/file-display-card'
import Body1 from 'shared/text/body1'
import { MinusCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid'
import ExamResultTag from 'shared/card/exam-result-tag'
import QuestionAlternativeCorrection from './question-alternative-correction'
import { ShieldCheckIcon } from '@heroicons/react/24/solid'
import SectionTitle from 'shared/text/section-title'

type QuestionCorrectionCardProps = {
  question: QuestionWithAnswer
  questionIndex: number
}
const QuestionCorrectionCard = ({ question, questionIndex }: QuestionCorrectionCardProps) => {
  return (
    <div className="relative flex flex-col w-full gap-4 p-4 pt-3 mb-4 bg-white rounded-xl">
      <div className="absolute top-0 left-0 px-3 py-1.5 font-bold text-white bg-blue-500 rounded-br-lg rounded-tl-xl">
        {questionIndex + 1}
      </div>
      <div className="absolute top-0 right-0 px-1 py-2">
        <ExamResultTag className="px-3 text-sm" points={question.getPoints()}></ExamResultTag>
      </div>
      <Body1 className="ml-7 before:float-right before:w-20 before:h-1 before:content-[' '] before:ml-2 text-md">
        {question.description}
      </Body1>
      <div className="flex flex-wrap gap-4">
        {question.images?.map((image) => (
          <FileDisplayCard key={image.fullPath} file={image} />
        ))}
      </div>

      <div className="w-[inherit] flex flex-col gap-2 pl-4">
        <div className="flex items-center gap-1 -ml-1">
          {question.answer === null && (
            <>
              <QuestionMarkCircleIcon className="w-6 h-6 text-blue-500" aria-hidden="true" />
              <Body1 className="italic font-normal">Non lo so</Body1>
            </>
          )}
          {question.answer === undefined && (
            <>
              <MinusCircleIcon className="w-6 h-6 text-slate-500" aria-hidden="true" />
              <Body1 className="italic font-normal">Senza risposta</Body1>
            </>
          )}
        </div>
        {question.alternatives.map((alternative, index) => (
          <QuestionAlternativeCorrection
            key={alternative.id}
            index={index}
            text={alternative.text}
            isSelected={question.answer?.id === alternative.id}
            isCorrect={alternative.isCorrect}
          />
        ))}
      </div>
      <hr />
      <div className="w-[inherit] flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheckIcon className="w-6 h-auto text-green-800" />
          <SectionTitle className="text-lg">Correzione</SectionTitle>
        </div>
        {question.correctionText && <Body1 className="text-md">{question.correctionText}</Body1>}
        <div className="flex flex-wrap gap-4">
          {question.correctionImages?.map((image) => (
            <FileDisplayCard key={image.fullPath} file={image} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default QuestionCorrectionCard
