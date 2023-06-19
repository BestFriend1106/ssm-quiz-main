import { twMerge } from 'tailwind-merge'
import { QuestionType } from 'domain/question'
import { useTextInEllipsis } from 'lib/hooks/useTextInEllipsis'
import Tooltip from 'shared/overlay/tooltip'
import Body1 from 'shared/text/body1'
import Body2 from 'shared/text/body2'
import { TrashIcon } from '@heroicons/react/20/solid'

type QuestionCardProps = {
  description: string
  type: QuestionType
  item?: string
  className?: string
  cardClassName?: string
  onClick?(): void
  onDelete?(): void
}
const QuestionCard = ({ description, type, item, className, cardClassName, onClick, onDelete }: QuestionCardProps) => {
  const { textRef: questionDescriptionRef, hasEllipsis } = useTextInEllipsis<HTMLHeadingElement>()

  return (
    <div className={twMerge('grid', onDelete ? 'grid-cols-[1fr_13fr]' : 'grid-cols-1', className)}>
      {onDelete && (
        <div
          className="grid self-center w-auto h-full bg-red-500 border-2 border-r-0 cursor-pointer rounded-l-3xl place-items-center"
          onClick={onDelete}
        >
          <TrashIcon className="w-4 h-4 text-white" />
        </div>
      )}
      <div
        className={twMerge(
          'border-2 min-w-full px-5 py-2 bg-white rounded-r-3xl',
          cardClassName,
          onDelete ? 'border-l-0' : 'rounded-3xl',
          onClick && 'cursor-pointer hover:bg-green-100'
        )}
        onClick={onClick}
      >
        <Tooltip content={description} show={hasEllipsis}>
          <Body1 ref={questionDescriptionRef} className="mb-2 truncate">
            {description}
          </Body1>
        </Tooltip>
        {item && <Body2 className="mb-1">{item}</Body2>}
        <Body2 className="text-slate-500">Tipo: {type}</Body2>
      </div>
    </div>
  )
}

export default QuestionCard
