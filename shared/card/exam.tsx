import { ClockIcon, QuestionMarkCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { useTextInEllipsis } from 'lib/hooks/useTextInEllipsis'
import Tooltip from '../overlay/tooltip'
import Body1 from '../text/body1'
import Body2 from '../text/body2'
import { twMerge } from 'tailwind-merge'
import StaticTag from './static-tag'
import { ClipboardDocumentListIcon as ExamsIcon } from '@heroicons/react/24/solid'

type ExamCardProps = {
  title: string
  description: string
  duration: number
  questionsCount: number
  disciplines?: string[]
  onClick?(): void
}

const ExamCard = ({ title, description, duration, questionsCount, disciplines, onClick }: ExamCardProps) => {
  const { textRef: examTitleRef, hasEllipsis: hasEllipsisOnTitle } = useTextInEllipsis<HTMLHeadingElement>()
  const { textRef: examDescriptionRef, hasEllipsis: hasEllipsisOnDescription } = useTextInEllipsis<HTMLHeadingElement>()
  const { textRef: disciplinesContainerRef, hasEllipsis: hasHiddenDisciplines } =
    useTextInEllipsis<HTMLHeadingElement>()

  const hoverClassName = 'cursor-pointer hover:bg-slate-100'
  const iconClassName = 'text-blue-500 w-5 h-5'
  return (
    <div
      className={twMerge(
        'px-4 pt-6 pb-2 bg-white border-2 min-w-[256px] w-64 rounded-xl relative',
        onClick && hoverClassName
      )}
      onClick={onClick}
    >
      <span className="absolute top-0 left-0 grid h-6 bg-blue-400 rounded-tl-lg rounded-tr-none rounded-bl-none rounded-br-md aspect-square place-content-center">
        <ExamsIcon className="w-4 h-4 text-white" />
      </span>
      <div className="inline-flex flex-grow w-full min-w-0 gap-2">
        <Tooltip content={title} show={hasEllipsisOnTitle}>
          <Body1 ref={examTitleRef} className="mb-1 text-base truncate">
            {title}
          </Body1>
        </Tooltip>
      </div>
      <Tooltip content={description} show={hasEllipsisOnDescription}>
        <Body2 ref={examDescriptionRef} className="mb-2 truncate">
          <InformationCircleIcon className="self-start inline w-4 h-4 mr-1 -translate-y-[0.1rem] text-slate-600" />{' '}
          {description}
        </Body2>
      </Tooltip>
      <Tooltip
        content={
          <ul>
            {disciplines?.map((discipline) => (
              <li key={discipline}>{discipline}</li>
            ))}
          </ul>
        }
        show={hasHiddenDisciplines}
      >
        <div ref={disciplinesContainerRef} className="flex gap-1 overflow-x-scroll truncate">
          {disciplines?.map((discipline) => (
            <StaticTag key={discipline}>{discipline}</StaticTag>
          ))}
        </div>
      </Tooltip>
      <div className="flex flex-wrap gap-2 mt-2">
        <div className="flex items-center gap-1">
          <ClockIcon className={iconClassName} />
          <Body2>
            <span className="text-base font-medium">{duration}</span> minuti
          </Body2>
        </div>
        <div className="flex items-center gap-1">
          <QuestionMarkCircleIcon className={iconClassName} />
          <Body2>
            <span className="text-base font-medium">{questionsCount}</span> domande
          </Body2>
        </div>
      </div>
    </div>
  )
}

export default ExamCard
