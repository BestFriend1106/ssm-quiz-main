import { twMerge } from 'tailwind-merge'
import { PlayIcon } from '@heroicons/react/20/solid'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import Body1 from 'shared/text/body1'
import Body2 from 'shared/text/body2'
import StaticTag from 'shared/card/static-tag'
import ExamResultTag from 'shared/card/exam-result-tag'
import { formatDate } from 'lib/utils/dates-formatter'
import Tooltip from 'shared/overlay/tooltip'

const ExamResultsCard = ({
  createdAt,
  isStillRunning,
  points,
  onClick,
  onCorrectionClick,
  className,
}: {
  createdAt?: Date
  isStillRunning: boolean
  points: number
  className?: string
  onClick?(): void
  onCorrectionClick?(): void
}) => {
  return (
    <div
      className={twMerge(
        'px-4 py-2 border border-slate-200 rounded-2xl flex gap-4 items-center justify-between',
        onClick && 'cursor-pointer hover:bg-slate-50',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center">
        {!isStillRunning && onCorrectionClick && (
          <Tooltip content="Correzione" translateX={-1.5}>
            <InformationCircleIcon className="w-5 h-5 mr-3 text-blue-500 cursor-pointer" onClick={onCorrectionClick} />
          </Tooltip>
        )}
        <div>
          <Body1 className="font-medium text-slate-700">
            {createdAt && formatDate(createdAt, 'human_readable_date')}
          </Body1>
          <Body2 className="italic">{createdAt && formatDate(createdAt, 'time')}</Body2>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        {isStillRunning ? (
          <StaticTag className="flex items-center gap-1 font-semibold text-white bg-blue-500">
            <PlayIcon className="w-3 h-3" />
            In corso
          </StaticTag>
        ) : (
          <ExamResultTag points={points} />
        )}
        {onClick && <ArrowTopRightOnSquareIcon className="w-4 h-4 mb-0.5 text-slate-500" />}
      </div>
    </div>
  )
}

export default ExamResultsCard
