import { ExamTaken } from 'domain/exams/exam-domain'
import Body1 from 'shared/text/body1'
import Countdown from 'react-countdown'
import { twMerge } from 'tailwind-merge'
import Body2 from 'shared/text/body2'
import { ForwardedRef } from 'react'

const COUNTDOWN_STEP_IN_MINUTES = 5

export const TimeCountdownSection = ({
  countdownRef,
  examTaken,
  onTimeIsOver,
}: {
  countdownRef: ForwardedRef<Countdown>
  examTaken: ExamTaken
  onTimeIsOver(): void
}) => {
  return (
    <Countdown
      ref={countdownRef}
      date={examTaken.endAt}
      renderer={({ hours, minutes, seconds }) => {
        const minutesLeft = hours * 60 + minutes
        const minutesLeftWithSeconds = minutesLeft + seconds / 60
        const percentageTimeLeftInMinutes = (100 * minutesLeftWithSeconds) / examTaken.duration
        const isLastMinute = minutesLeftWithSeconds <= 1

        const totalMarkersToAdd = Math.trunc(examTaken.duration / COUNTDOWN_STEP_IN_MINUTES) + 1
        const isExamDurationPartOfTheMarkersLabels = examTaken.duration % (2 * COUNTDOWN_STEP_IN_MINUTES) === 0
        return (
          <div className="grid grid-cols-[minmax(70%,_auto)_auto] px-6 py-4 gap-x-2">
            <div>
              <ExamProgressBar isLastMinute={isLastMinute} percentageTimeLeftInMinutes={percentageTimeLeftInMinutes} />
              <div className="flex justify-between mt-3 items-top">
                {Array.from({
                  length: totalMarkersToAdd,
                }).map((_, index) => (
                  <div key={index} className="relative flex flex-col items-center gap-2">
                    <div
                      className={twMerge(
                        'border-l-[1.2px] h-2 w-0',
                        index % 2 ? 'border-[#C4CCD4]' : 'border-[#196AA2]'
                      )}
                    />
                    {index % 2 === 0 && (
                      <Body2 className="text-sm font-bold">{index * COUNTDOWN_STEP_IN_MINUTES}</Body2>
                    )}
                    {index === totalMarkersToAdd - 1 && !isExamDurationPartOfTheMarkersLabels && (
                      <Body2 className="text-sm font-bold">{examTaken.duration}</Body2>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
              <Body1 className="text-center text-sm text-[#36454F] font-semibold">Tempo Mancente</Body1>
              <Body2 className="text-[#36454F] text-3xl font-semibold">{`${minutesLeft}:${String(seconds).padStart(
                2,
                '0'
              )}`}</Body2>
            </div>
          </div>
        )
      }}
      onComplete={onTimeIsOver}
    />
  )
}

function ExamProgressBar({
  isLastMinute,
  percentageTimeLeftInMinutes,
}: {
  isLastMinute: boolean
  percentageTimeLeftInMinutes: number
}) {
  const widthPercentageStyle = {
    width: `${percentageTimeLeftInMinutes}%`,
  }
  return (
    <div className="relative h-fit">
      <div className="w-full h-9 border border-[#7C8389] rounded-[3px] bg-[#F8F6F9]">
        <div
          className={twMerge('h-full bg-[#7AA6C3] rounded-[2px]', isLastMinute && 'bg-red-300')}
          style={widthPercentageStyle}
        />
      </div>
      <div className="absolute bottom-[10px] w-full h-[10px] bg-white border-x border-[#7C8389]">
        <div className={twMerge('h-full bg-[#1869A1]', isLastMinute && 'bg-red-500')} style={widthPercentageStyle} />
      </div>
    </div>
  )
}
