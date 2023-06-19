import { useRouter } from 'next/router'
import { useUserContext } from 'lib/userContext'
import SectionTitle from 'shared/text/section-title'
import Body1 from 'shared/text/body1'
import LoadingSpinner from 'shared/icon/loading-spinner'
import { Routes } from 'lib/utils/routes'
import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import { useQuery } from 'react-query'
import StaticTag from 'shared/card/static-tag'
import classNames from 'classnames'
import { ExamRankingRepository } from 'lib/repositories/exam-ranking-repository'
import { ExamRepository } from 'lib/repositories/exam-repository'
import BaseContentWithTableLayout from 'app/admin/layout/base-content-with-table-layout'
import { UserExamResult } from 'domain/exams-ranking/exam-ranking-domain'
import { ColumnDef } from '@tanstack/react-table'
import UserAvatar from 'shared/card/user-avatar'
import ExamResultTag from 'shared/card/exam-result-tag'
import { ChartBarIcon } from '@heroicons/react/24/solid'

const ExamRankingPage = () => {
  const router = useRouter()
  const { firebaseUser } = useUserContext()

  const { examId } = router.query

  const { data: examRanking } = useQuery({
    queryKey: ['examRanking', examId],
    queryFn: async () => await ExamRankingRepository.getExamRankingByExamId(examId! as string),
    enabled: !!examId && typeof examId == 'string' && !!firebaseUser?.uid,
  })

  const { data: exam } = useQuery({
    queryKey: ['exam', examId],
    queryFn: async () => {
      if (!examId || typeof examId !== 'string') return
      return await ExamRepository.getAppExam(examId)
    },
    enabled: !!examId && typeof examId == 'string',
  })

  if (!firebaseUser?.uid || !examRanking || !exam) return <LoadingSpinner />
  console.log('examRanking', examRanking)
  const userRankingPosition = examRanking.getUserPositionOnRanking(firebaseUser.uid)

  return (
    <>
      <div className="w-screen h-screen p-2 overflow-y-scroll bg-blue-200 md:p-10 bg-opacity-30">
        <div className="flex flex-col items-start w-full gap-2 mx-auto">
          <ArrowLeftIcon
            className="w-6 h-6 cursor-pointer"
            onClick={() => router.push({ pathname: Routes.appExamDetails, query: { examId } })}
          />
          <div className="grid grid-cols-2 sm:grid-cols-[4fr_1fr] w-full gap-4">
            <div className="flex items-center w-full gap-3 p-4 bg-white rounded-xl">
              <div className="grid bg-green-500 rounded-lg h-14 aspect-square place-content-center">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col gap-1 pb-2">
                <SectionTitle>Graduatoria</SectionTitle>
                <Body1 className="font-normal align-top">{exam.title}</Body1>
              </div>
            </div>
            {userRankingPosition && <UserPositionOnRanking userPosition={userRankingPosition} className="order-2" />}
          </div>
        </div>
        <RankingTableContent usersExamResults={examRanking.getRankingByPoints()} />
      </div>
    </>
  )
}

export default ExamRankingPage

const UserPositionOnRanking = ({ userPosition, className }: { userPosition: number; className?: string }) => (
  <div className={classNames('flex flex-col items-center p-4 bg-white rounded-xl', className)}>
    <Body1 className="text-lg font-semibold">Tua Posizione</Body1>
    <div className="flex items-center justify-center h-full pb-2">
      <StaticTag className="text-xl font-bold text-white bg-green-500"># {userPosition}</StaticTag>
    </div>
  </div>
)

const RankingTableContent = ({ usersExamResults }: { usersExamResults: UserExamResult[] }) => {
  const examsTableColumns: ColumnDef<UserExamResult>[] = [
    {
      accessorKey: 'position',
      header: '#',
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <StaticTag
            className={classNames(
              'flex items-center justify-center w-8 h-auto text-lg aspect-square',
              row.index === 0 && 'bg-yellow-400 font-bold text-white',
              row.index === 1 && 'bg-gray-400 font-bold text-white',
              row.index === 2 && 'bg-orange-900 font-bold text-white'
            )}
          >
            {row.index + 1}
          </StaticTag>
        </div>
      ),
      meta: {
        isCentered: true,
        className: 'pl-0',
      },
    },
    {
      accessorKey: 'nickname',
      header: 'Nickname',
      cell: ({ getValue, row }) => (
        <div className="flex items-center justify-start min-w-0 gap-4 my-2">
          <UserAvatar photoUrl={row.original.profilePicture} displayName={row.original.nickname} />
          <Body1 className="text-base font-bold text-blue-500 capitalize">{getValue() as string}</Body1>
        </div>
      ),
      meta: {
        className: 'pl-8 w-fit',
      },
    },
    {
      accessorKey: 'points',
      header: 'Punteggio',
      cell: (info) => (
        <div className="flex items-center justify-center min-w-0">
          <ExamResultTag className="px-3 text-md" points={info.getValue() as number} />
        </div>
      ),
      meta: {
        isCentered: true,
        className: 'text-md font-medium',
      },
    },
    {
      accessorKey: 'ssmSubject',
      header: 'SSM',
      cell: (info) => info.getValue(),
      meta: {
        isCentered: true,
        className: 'text-md font-medium',
      },
    },
    {
      accessorKey: 'university',
      header: 'Facoltà',
      cell: (info) => info.getValue(),
      meta: {
        isCentered: true,
        className: 'text-md font-medium',
      },
    },
  ]
  return (
    <div>
      <BaseContentWithTableLayout<UserExamResult>
        data={usersExamResults}
        tableColumns={examsTableColumns}
        noDataText="Nessuna risposta trovata per l'esame"
        displaySearch={false}
      />
    </div>
  )
}
