import classNames from 'classnames'
import CheckboxInput from 'shared/input/checkbox-input'
import Body1 from 'shared/text/body1'
import { twMerge } from 'tailwind-merge'

type QuestionAlternativeCorrectionProps = {
  index: number
  text: string
  isSelected: boolean
  isCorrect?: boolean
}

const QuestionAlternativeCorrection = ({
  index,
  text,
  isSelected,
  isCorrect = false,
}: QuestionAlternativeCorrectionProps) => {
  return (
    <div className="flex items-center w-full grow">
      <div className="flex items-center justify-center h-full mr-2 text-white rounded-lg cursor-pointer aspect-square">
        <CheckboxInput
          inputClassName={classNames(
            'shadow-none focus:ring-0 active:ring-0 ring-0',
            isSelected && !isCorrect && 'border-red-500 border-4 text-red-500 focus:red-200'
          )}
          defaultChecked={isCorrect}
          disabled
        />
      </div>
      <div
        className={twMerge(
          'flex items-center justify-center h-full mr-2 uppercase rounded-lg text-slate-500 aspect-square',
          isCorrect && 'font-bold text-green-500',
          isSelected && !isCorrect && 'font-bold text-red-500'
        )}
      >
        {String.fromCharCode(97 + index)}.
      </div>
      <Body1 className={classNames(isCorrect && 'text-green-500', isSelected && !isCorrect && 'text-red-500')}>
        {text}
      </Body1>
    </div>
  )
}

export default QuestionAlternativeCorrection
