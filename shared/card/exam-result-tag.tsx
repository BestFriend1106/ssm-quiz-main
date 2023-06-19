import React from 'react'
import StaticTag from './static-tag'
import { twMerge } from 'tailwind-merge'

type ExamResultTagProps = {
  points: number
  className?: string
}

const ExamResultTag = ({ points, className }: ExamResultTagProps) => {
  const pointsDisplayText = points === 1 ? 'punto' : 'punti'
  const positivePointsClassName = 'font-semibold text-white bg-green-500'
  const negativePointsClassName = 'font-semibold text-white bg-red-500'
  return (
    <StaticTag
      className={twMerge(points > 0 && positivePointsClassName, points < 0 && negativePointsClassName, className)}
    >
      {points} {pointsDisplayText}
    </StaticTag>
  )
}

export default ExamResultTag
