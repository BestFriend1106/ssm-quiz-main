import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { ColumnDef } from '@tanstack/react-table'
import { ExamFull } from 'domain/exams/exam-domain'
import IndeterminateCheckbox from 'shared/input/checkbox-input-indeterminate'
import BaseContentWithTableLayout from '../layout/base-content-with-table-layout'

type ExamsPageContentProps = {
  onOpenExamInfo?(exam?: ExamFull): void
  onDeleteExam?(exam?: ExamFull): void
  exams: ExamFull[]
  isLoading?: boolean
}

const ExamsPageContent = ({ exams = [], onOpenExamInfo, onDeleteExam, isLoading = false }: ExamsPageContentProps) => {
  const examsTableColumns: ColumnDef<ExamFull>[] = [
    {
      id: 'actions',
      header: ({ table }) => (
        <IndeterminateCheckbox
          className="mr-2"
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-between">
          <IndeterminateCheckbox
            checked={row.getIsSelected()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
          <PencilIcon
            className="w-4 h-4 ml-4 cursor-pointer"
            onClick={() => {
              onOpenExamInfo?.(row.original)
            }}
          />
          <TrashIcon className="w-4 h-4 ml-4 cursor-pointer" onClick={() => onDeleteExam?.(row.original)} />
        </div>
      ),
      meta: {
        className: 'pl-4 w-0',
      },
    },
    {
      accessorKey: 'duration',
      header: 'durata',
      cell: (info) => {
        const duration = info.getValue() as number
        const minutesPluralized = duration > 1 ? 'minuti' : 'minuto'
        return `${duration} ${minutesPluralized}`
      },
      meta: {
        isCentered: true,
      },
    },
    {
      accessorKey: 'title',
      header: 'titolo',
      cell: (info) => info.getValue(),
      meta: {
        isTruncated: true,
      },
    },
    {
      accessorKey: 'description',
      header: 'descrizione',
      cell: (info) => info.getValue(),
      meta: {
        isTruncated: true,
      },
    },
  ]
  return (
    <BaseContentWithTableLayout<ExamFull>
      data={exams}
      tableColumns={examsTableColumns}
      isLoading={isLoading}
      onOpenDataInfo={onOpenExamInfo}
      noDataText="Nessun esame disponibile"
    />
  )
}

export default ExamsPageContent
