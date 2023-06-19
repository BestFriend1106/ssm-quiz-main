import classNames from 'classnames'
import CheckboxInput from 'shared/input/checkbox-input'
import Body1 from 'shared/text/body1'
import { twMerge } from 'tailwind-merge'

type QuestionAlternativeCheckboxProps = {
  index: number
  text: string
  isSelected: boolean
  onSelect?(): void
  onUnselect?(): void
}

const QuestionAlternativeCheckbox = ({
  index,
  text,
  isSelected,
  onSelect,
  onUnselect,
}: QuestionAlternativeCheckboxProps) => {
  const alternativeClickAction = isSelected ? onUnselect : onSelect
  return (
    <div
      className={twMerge(
        'flex items-center w-full cursor-pointer grow px-4 py-3 gap-4',
        isSelected && 'bg-[#B3D1FC]',
        !isSelected && index % 2 === 0 && 'bg-[#E1E1E1]',
        !isSelected && index % 2 !== 0 && 'bg-[#FFFFFF]'
      )}
      onClick={alternativeClickAction}
    >
      <div
        className={classNames(
          'flex items-center justify-center h-full text-white rounded-lg aspect-square cursor-pointer'
        )}
      >
        <CheckboxInput
          inputClassName={twMerge(
            'shadow-none active:ring-0 checked:ring-0 ring-transparent border-[#9FA2A7] checked:border-[#9FA2A7] focus:border-[#9FA2A7] border-[1.5px] bg-gradient-to-b from-[#FFFFFF] to-[#D2DFEC] text-blue-500'
          )}
          checked={isSelected}
          onChange={() => alternativeClickAction?.()}
        />
      </div>
      <Body1
        className={twMerge('flex items-center justify-center gap-2 uppercase text-[#2C2525] font-inter font-semibold')}
      >
        {String.fromCharCode(97 + index)}. &nbsp;{text}
      </Body1>
    </div>
  )
}

export default QuestionAlternativeCheckbox
