import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { ColumnDef } from '@tanstack/react-table'
import { QuestionFull, QuestionType } from 'domain/question'
import IndeterminateCheckbox from 'shared/input/checkbox-input-indeterminate'
import BaseContentWithTableLayout from '../layout/base-content-with-table-layout'

type QuestionsPageContentProps = {
  onOpenQuestionInfo?(question?: QuestionFull): void
  onDeleteQuestion?(question?: QuestionFull): void
  questions: QuestionFull[]
  isLoading?: boolean
}

const QuestionsPageContent = ({
  questions = [],
  onOpenQuestionInfo,
  onDeleteQuestion,
  isLoading = false,
}: QuestionsPageContentProps) => {
  const questionsTableColumns: ColumnDef<QuestionFull>[] = [
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
              onOpenQuestionInfo?.(row.original)
            }}
          />
          <TrashIcon className="w-4 h-4 ml-4 cursor-pointer" onClick={() => onDeleteQuestion?.(row.original)} />
        </div>
      ),
      meta: {
        className: 'pl-4 w-0',
      },
    },
    {
      accessorKey: 'type',
      header: 'Tipo',
      cell: (info) => (info.getValue() as QuestionType).valueOf(),
      meta: {
        isCentered: true,
        className: 'pl-0 w-fit',
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
    {
      accessorKey: 'item',
      header: 'Item',
      cell: (info) => info.getValue(),
      meta: {
        isTruncated: true,
      },
    },
  ]
  return (
    <BaseContentWithTableLayout<QuestionFull>
      data={questions}
      tableColumns={questionsTableColumns}
      isLoading={isLoading}
      onOpenDataInfo={onOpenQuestionInfo}
      noDataText="Nessuna domanda disponibile"
    />
  )
}

export default QuestionsPageContent
